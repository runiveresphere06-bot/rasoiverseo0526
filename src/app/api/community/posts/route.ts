import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const schema = z.object({
  title: z.string().optional(),
  content: z.string().min(10, "Please write at least a few sentences"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  recipeId: z.string().optional(),
});

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const post = await prisma.communityPost.create({
      data: {
        title: parsed.data.title?.trim() || null,
        content: parsed.data.content.trim(),
        imageUrl: parsed.data.imageUrl?.trim() || null,
        recipeId: parsed.data.recipeId || null,
        userId: session!.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Post submitted for review. It will appear once approved.",
        id: post.id,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Community post error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
