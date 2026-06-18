import { Resend } from "resend";
import { BRAND } from "@/lib/constants";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromAddress =
  process.env.EMAIL_FROM ?? "RasoiVerse <onboarding@resend.dev>";

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  if (!resend) {
    console.log("[DEV] Verification email:", { email, verifyUrl });
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `Verify your ${BRAND.name} account`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #111111;">Welcome to ${BRAND.name}</h1>
          <p>Please verify your email address to start exploring India's finest recipes.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #F4A300; color: #111111; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  if (!resend) {
    console.log("[DEV] Password reset email:", { email, resetUrl });
    return { success: true };
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `Reset your ${BRAND.name} password`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #111111;">Reset your password</h1>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #F4A300; color: #111111; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
