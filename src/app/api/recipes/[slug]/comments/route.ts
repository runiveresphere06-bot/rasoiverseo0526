import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getRecipeIdBySlug } from "@/lib/engagement";

const commentSchema = z.object({
  content: z.string().min(2).max(2000),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const recipe = await getRecipeIdBySlug(slug);
  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  const comments = await prisma.comment.findMany({
    where: { recipeId: recipe.id, isHidden: false },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ comments });
}

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
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid comment" },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content: parsed.data.content.trim(),
        userId: session!.user.id,
        recipeId: recipe.id,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (err) {
    console.error("Comment error:", err);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}
