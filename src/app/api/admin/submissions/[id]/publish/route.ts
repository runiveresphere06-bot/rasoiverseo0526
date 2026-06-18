import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { generateUniqueSlug } from "@/lib/recipes";
import type { Ingredient, Instruction } from "@/types/recipe";

const ingredientSchema = z.object({ item: z.string().min(1), amount: z.string().min(1) });
const instructionSchema = z.object({ step: z.number(), text: z.string().min(1) });

const publishSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  story: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1),
  instructions: z.array(instructionSchema).min(1),
  prepTime: z.number().optional(),
  cookTime: z.number().optional(),
  servings: z.number().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  stateId: z.string().optional(),
  categoryIds: z.array(z.string()).default([]),
  festivalId: z.string().optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean().optional(),
  trending: z.boolean().optional(),
  communityFavorite: z.boolean().optional(),
  grandmasPick: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const submission = await prisma.recipeSubmission.findUnique({ where: { id } });
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    if (submission.status !== "PENDING") {
      return NextResponse.json({ error: "Submission already processed" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = publishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const slug = data.slug?.trim()
      ? data.slug.trim()
      : await generateUniqueSlug(data.title);

    const existingSlug = await prisma.recipe.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const recipe = await prisma.$transaction(async (tx) => {
      const created = await tx.recipe.create({
        data: {
          title: data.title,
          slug,
          description: data.description,
          story: data.story ?? submission.story,
          ingredients: data.ingredients as Ingredient[],
          instructions: data.instructions as Instruction[],
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          servings: data.servings,
          difficulty: data.difficulty,
          status: "PUBLISHED",
          featured: data.featured ?? false,
          trending: data.trending ?? false,
          communityFavorite: data.communityFavorite ?? false,
          grandmasPick: data.grandmasPick ?? false,
          imageUrl: data.imageUrl ?? submission.imageUrl,
          seoTitle: data.seoTitle ?? `${data.title} | RasoiVerse`,
          seoDescription: data.seoDescription ?? data.description,
          publishedAt: new Date(),
          stateId: data.stateId || null,
          festivalId: data.festivalId || null,
          authorId: submission.userId,
          submissionId: submission.id,
          categories: {
            create: data.categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
      });

      await tx.recipeSubmission.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          moderatorId: session!.user.id,
        },
      });

      return created;
    });

    return NextResponse.json({ recipe, message: "Recipe published successfully" });
  } catch (err) {
    console.error("Publish error:", err);
    return NextResponse.json({ error: "Failed to publish recipe" }, { status: 500 });
  }
}
