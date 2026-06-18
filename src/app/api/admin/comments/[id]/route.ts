import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const { isHidden } = await request.json();

    const comment = await prisma.comment.update({
      where: { id },
      data: { isHidden: !!isHidden },
    });

    return NextResponse.json({ comment });
  } catch (err) {
    console.error("Comment moderation error:", err);
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Comment delete error:", err);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
