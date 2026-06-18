import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.communityPost.update({
      where: { id },
      data: { status: "PUBLISHED" },
    });
    return NextResponse.json({ message: "Post published" });
  } catch (err) {
    console.error("Approve post error:", err);
    return NextResponse.json({ error: "Failed to approve post" }, { status: 500 });
  }
}
