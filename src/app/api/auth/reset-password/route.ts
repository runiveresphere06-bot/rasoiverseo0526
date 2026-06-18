import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters with uppercase and number" },
        { status: 400 },
      );
    }

    const { token, password } = parsed.data;

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (
      !verificationToken ||
      !verificationToken.identifier.startsWith("reset:") ||
      verificationToken.expires < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 },
      );
    }

    const email = verificationToken.identifier.replace("reset:", "");
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
