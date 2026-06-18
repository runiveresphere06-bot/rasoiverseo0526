import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

const schema = z.object({
  rawContent: z.string().min(20, "Please write at least a few sentences about your recipe"),
  title: z.string().optional(),
  story: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
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

    const { rawContent, title, story, imageUrl } = parsed.data;

    const submission = await prisma.recipeSubmission.create({
      data: {
        rawContent: rawContent.trim(),
        title: title?.trim() || null,
        story: story?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        userId: session!.user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Recipe submitted! Our team will review and publish it soon.",
        id: submission.id,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: "Failed to submit recipe" }, { status: 500 });
  }
}
