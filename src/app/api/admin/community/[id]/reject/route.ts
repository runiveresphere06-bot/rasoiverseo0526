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
      data: { status: "REJECTED" },
    });
    return NextResponse.json({ message: "Post rejected" });
  } catch (err) {
    console.error("Reject post error:", err);
    return NextResponse.json({ error: "Failed to reject post" }, { status: 500 });
  }
}
