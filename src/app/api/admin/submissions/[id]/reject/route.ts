import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

const schema = z.object({
  adminNotes: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = schema.safeParse(body);

    const submission = await prisma.recipeSubmission.findUnique({ where: { id } });
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    if (submission.status !== "PENDING") {
      return NextResponse.json({ error: "Submission already processed" }, { status: 400 });
    }

    await prisma.recipeSubmission.update({
      where: { id },
      data: {
        status: "REJECTED",
        moderatorId: session!.user.id,
        adminNotes: parsed.success ? parsed.data.adminNotes : undefined,
      },
    });

    return NextResponse.json({ message: "Submission rejected" });
  } catch (err) {
    console.error("Reject error:", err);
    return NextResponse.json({ error: "Failed to reject submission" }, { status: 500 });
  }
}
