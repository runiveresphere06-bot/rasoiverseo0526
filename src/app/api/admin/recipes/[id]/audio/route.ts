import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { isCloudinaryConfigured } from "@/lib/cloudinary";

const schema = z.object({
  language: z.enum(["ENGLISH", "HINDI", "MARATHI"]),
  audioUrl: z.string().url(),
  publicId: z.string().optional(),
  duration: z.number().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const audio = await prisma.recipeAudio.upsert({
      where: {
        recipeId_language: {
          recipeId: id,
          language: parsed.data.language,
        },
      },
      create: {
        recipeId: id,
        language: parsed.data.language,
        audioUrl: parsed.data.audioUrl,
        publicId: parsed.data.publicId,
        duration: parsed.data.duration,
      },
      update: {
        audioUrl: parsed.data.audioUrl,
        publicId: parsed.data.publicId,
        duration: parsed.data.duration,
      },
    });

    return NextResponse.json({
      audio,
      cloudinaryReady: isCloudinaryConfigured(),
    });
  } catch (err) {
    console.error("Audio upload error:", err);
    return NextResponse.json({ error: "Failed to save audio" }, { status: 500 });
  }
}
