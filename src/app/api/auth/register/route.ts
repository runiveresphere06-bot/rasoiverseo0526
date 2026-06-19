import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// removed email verification flow: no token generation
import { z } from "zod";
import { prisma } from "@/lib/prisma";
// sendVerificationEmail removed from register flow
import { ADMIN_EMAILS } from "@/lib/constants";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const isAdmin = ADMIN_EMAILS.includes(
      normalizedEmail as (typeof ADMIN_EMAILS)[number],
    );

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        role: isAdmin ? "ADMIN" : "USER",
      },
    });

    // Auto-verify email since verification flow removed
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json(
      {
        message: "Account created. You can now sign in.",
        userId: user.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
