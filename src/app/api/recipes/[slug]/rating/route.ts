import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getRecipeIdBySlug } from "@/lib/engagement";

const schema = z.object({
  value: z.number().int().min(1).max(5),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { slug } = await params;
  const recipe = await getRecipeIdBySlug(slug);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_recipeId: { userId: session!.user.id, recipeId: recipe.id },
      },
      create: {
        userId: session!.user.id,
        recipeId: recipe.id,
        value: parsed.data.value,
      },
      update: { value: parsed.data.value },
    });

    const allRatings = await prisma.rating.findMany({
      where: { recipeId: recipe.id },
      select: { value: true },
    });
    const average =
      allRatings.reduce((sum, r) => sum + r.value, 0) / allRatings.length;

    return NextResponse.json({
      rating,
      average: Math.round(average * 10) / 10,
      count: allRatings.length,
    });
  } catch (err) {
    console.error("Rating error:", err);
    return NextResponse.json({ error: "Failed to rate recipe" }, { status: 500 });
  }
}
