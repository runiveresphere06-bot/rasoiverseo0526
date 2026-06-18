import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error("Engagement query failed:", error);
    return fallback;
  }
}

export async function getRecipeEngagement(recipeId: string, userId?: string) {
  return safeQuery(
    async () => {
      const [favorite, userRating, favoriteCount] = await Promise.all([
        userId
          ? prisma.favorite.findUnique({
              where: { userId_recipeId: { userId, recipeId } },
            })
          : null,
        userId
          ? prisma.rating.findUnique({
              where: { userId_recipeId: { userId, recipeId } },
            })
          : null,
        prisma.favorite.count({ where: { recipeId } }),
      ]);

      return {
        isFavorited: !!favorite,
        userRating: userRating?.value ?? null,
        favoriteCount,
      };
    },
    { isFavorited: false, userRating: null, favoriteCount: 0 },
  );
}

export async function getRecipeComments(recipeId: string) {
  return safeQuery(
    () =>
      prisma.comment.findMany({
        where: { recipeId, isHidden: false },
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    [],
  );
}

export async function getUserFavorites(userId: string) {
  return safeQuery(
    () =>
      prisma.favorite.findMany({
        where: { userId },
        include: {
          recipe: {
            include: {
              state: true,
              festival: true,
              ratings: true,
              categories: { include: { category: true } },
              author: { select: { id: true, name: true, image: true } },
              audioTracks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    [],
  );
}

export async function getPublishedCommunityPosts(limit = 20) {
  return safeQuery(
    () =>
      prisma.communityPost.findMany({
        where: { status: "PUBLISHED" },
        include: {
          user: { select: { id: true, name: true, image: true } },
          recipe: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    [],
  );
}

export async function getAllCommunityPostsAdmin() {
  return safeQuery(
    () =>
      prisma.communityPost.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          recipe: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    [],
  );
}

export async function getAllCommentsAdmin() {
  return safeQuery(
    () =>
      prisma.comment.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          recipe: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    [],
  );
}

export async function getUserProfile(userId: string) {
  return safeQuery(
    () =>
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              recipes: { where: { status: "PUBLISHED" } },
              favorites: true,
              comments: true,
              submissions: true,
              communityPosts: { where: { status: "PUBLISHED" } },
            },
          },
        },
      }),
    null,
  );
}

export async function getRecipeIdBySlug(slug: string) {
  return safeQuery(
    () =>
      prisma.recipe.findFirst({
        where: { slug, status: "PUBLISHED" },
        select: { id: true },
      }),
    null,
  );
}

export type CommunityPostWithUser = Prisma.CommunityPostGetPayload<{
  include: {
    user: { select: { id: true; name: true; image: true } };
    recipe: { select: { id: true; title: true; slug: true } };
  };
}>;
