import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getRecipeIdBySlug } from "@/lib/engagement";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { slug } = await params;
  const recipe = await getRecipeIdBySlug(slug);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: {
      userId_recipeId: { userId: session!.user.id, recipeId: recipe.id },
    },
    create: { userId: session!.user.id, recipeId: recipe.id },
    update: {},
  });

  return NextResponse.json({ favorited: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { slug } = await params;
  const recipe = await getRecipeIdBySlug(slug);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  await prisma.favorite.deleteMany({
    where: { userId: session!.user.id, recipeId: recipe.id },
  });

  return NextResponse.json({ favorited: false });
}
