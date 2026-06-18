import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

const schema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (id === session!.user.id && parsed.data.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You cannot demote yourself" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error("Role update error:", err);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}
