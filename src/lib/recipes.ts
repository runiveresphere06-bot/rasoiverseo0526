import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { RecipeSearchParams } from "@/types/recipe";
import { slugify } from "@/lib/utils";

const recipeInclude = {
  state: true,
  festival: true,
  categories: { include: { category: true } },
  ratings: true,
  author: { select: { id: true, name: true, image: true } },
  audioTracks: true,
} satisfies Prisma.RecipeInclude;

export type RecipeWithRelations = Prisma.RecipeGetPayload<{
  include: typeof recipeInclude;
}>;

async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error("Database query failed:", error);
    return fallback;
  }
}

export async function getFeaturedRecipes(limit = 4) {
  return safeQuery(
    () =>
      prisma.recipe.findMany({
        where: { status: "PUBLISHED", featured: true },
        include: recipeInclude,
        orderBy: { publishedAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getTrendingRecipes(limit = 4) {
  return safeQuery(
    () =>
      prisma.recipe.findMany({
        where: { status: "PUBLISHED", trending: true },
        include: recipeInclude,
        orderBy: { viewCount: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getCommunityFavorites(limit = 4) {
  return safeQuery(
    () =>
      prisma.recipe.findMany({
        where: { status: "PUBLISHED", communityFavorite: true },
        include: recipeInclude,
        orderBy: { publishedAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getGrandmasRecipes(limit = 4) {
  return safeQuery(
    () =>
      prisma.recipe.findMany({
        where: { status: "PUBLISHED", grandmasPick: true },
        include: recipeInclude,
        orderBy: { publishedAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getRecentRecipes(limit = 4) {
  return safeQuery(
    () =>
      prisma.recipe.findMany({
        where: { status: "PUBLISHED" },
        include: recipeInclude,
        orderBy: { publishedAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getFestivalRecipes(limit = 4) {
  return safeQuery(
    () =>
      prisma.recipe.findMany({
        where: {
          status: "PUBLISHED",
          festivalId: { not: null },
        },
        include: { ...recipeInclude, festival: true },
        orderBy: { publishedAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getStatesWithRecipeCount() {
  return safeQuery(
    () =>
      prisma.state.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { recipes: { where: { status: "PUBLISHED" } } } },
        },
      }),
    [],
  );
}

export async function getTopContributors(limit = 5) {
  return safeQuery(
    () =>
      prisma.user.findMany({
        where: {
          recipes: { some: { status: "PUBLISHED" } },
        },
        select: {
          id: true,
          name: true,
          image: true,
          _count: { select: { recipes: { where: { status: "PUBLISHED" } } } },
        },
        orderBy: { recipes: { _count: "desc" } },
        take: limit,
      }),
    [],
  );
}

export async function getAdminStats() {
  return safeQuery(
    async () => {
      const [
        totalRecipes,
        publishedRecipes,
        pendingSubmissions,
        totalUsers,
        totalComments,
      ] = await Promise.all([
        prisma.recipe.count(),
        prisma.recipe.count({ where: { status: "PUBLISHED" } }),
        prisma.recipeSubmission.count({ where: { status: "PENDING" } }),
        prisma.user.count(),
        prisma.comment.count(),
      ]);

      return {
        totalRecipes,
        publishedRecipes,
        pendingSubmissions,
        totalUsers,
        totalComments,
      };
    },
    {
      totalRecipes: 0,
      publishedRecipes: 0,
      pendingSubmissions: 0,
      totalUsers: 0,
      totalComments: 0,
    },
  );
}

export async function getPendingSubmissions(limit = 10) {
  return safeQuery(
    () =>
      prisma.recipeSubmission.findMany({
        where: { status: "PENDING" },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getRecentUsers(limit = 10) {
  return safeQuery(
    () =>
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    [],
  );
}

export async function getAllUsers() {
  return getRecentUsers(100);
}

export async function searchRecipes(params: RecipeSearchParams = {}) {
  const {
    q,
    state,
    category,
    difficulty,
    festival,
    filter,
    sort = "recent",
    page = 1,
    limit = 12,
  } = params;

  const where: Prisma.RecipeWhereInput = {
    status: "PUBLISHED",
  };

  if (q?.trim()) {
    where.OR = [
      { title: { contains: q.trim(), mode: "insensitive" } },
      { description: { contains: q.trim(), mode: "insensitive" } },
      { story: { contains: q.trim(), mode: "insensitive" } },
    ];
  }

  if (state) {
    where.state = { slug: state };
  }

  if (category) {
    where.categories = { some: { category: { slug: category } } };
  }

  if (difficulty) {
    where.difficulty = difficulty;
  }

  if (festival) {
    where.festival = { slug: festival };
  }

  if (filter === "featured") where.featured = true;
  if (filter === "trending") where.trending = true;
  if (filter === "community") where.communityFavorite = true;
  if (filter === "grandmas") where.grandmasPick = true;

  const orderBy: Prisma.RecipeOrderByWithRelationInput =
    sort === "popular"
      ? { viewCount: "desc" }
      : sort === "rating"
        ? { ratings: { _count: "desc" } }
        : { publishedAt: "desc" };

  const skip = (page - 1) * limit;

  return safeQuery(
    async () => {
      const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
          where,
          include: recipeInclude,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.recipe.count({ where }),
      ]);

      return {
        recipes,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    },
    { recipes: [], total: 0, page: 1, totalPages: 0 },
  );
}

export async function getRecipeBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.recipe.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: {
          ...recipeInclude,
          comments: {
            where: { isHidden: false },
            include: {
              user: { select: { id: true, name: true, image: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 20,
          },
          _count: { select: { favorites: true, comments: true } },
        },
      }),
    null,
  );
}

export async function incrementRecipeViews(id: string) {
  return safeQuery(
    () =>
      prisma.recipe.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      }),
    null,
  );
}

export async function getAllStates() {
  return safeQuery(
    () =>
      prisma.state.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { recipes: { where: { status: "PUBLISHED" } } } },
        },
      }),
    [],
  );
}

export async function getStateBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.state.findUnique({
        where: { slug },
        include: {
          _count: { select: { recipes: { where: { status: "PUBLISHED" } } } },
        },
      }),
    null,
  );
}

export async function getAllCategories() {
  return safeQuery(
    () =>
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: {
          _count: { select: { recipes: true } },
        },
      }),
    [],
  );
}

export async function getAllFestivals() {
  return safeQuery(
    () => prisma.festival.findMany({ orderBy: { sortOrder: "asc" } }),
    [],
  );
}

export async function getSubmissionById(id: string) {
  return safeQuery(
    () =>
      prisma.recipeSubmission.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          publishedRecipe: true,
        },
      }),
    null,
  );
}

export async function getAllSubmissions(status?: "PENDING" | "REJECTED" | "PUBLISHED") {
  return safeQuery(
    () =>
      prisma.recipeSubmission.findMany({
        where: status ? { status } : undefined,
        include: {
          user: { select: { id: true, name: true, email: true } },
          publishedRecipe: { select: { id: true, slug: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    [],
  );
}

export async function getAllPublishedRecipesAdmin() {
  return safeQuery(
    () =>
      prisma.recipe.findMany({
        include: {
          state: true,
          author: { select: { name: true, email: true } },
          audioTracks: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
    [],
  );
}

export async function generateUniqueSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "recipe";
  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.recipe.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}
