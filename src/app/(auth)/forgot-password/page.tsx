"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-6 font-serif text-2xl font-semibold text-primary">
            Reset password
          </h1>
        </div>

        <div className="rounded-2xl border border-primary/8 bg-white p-8 shadow-sm">
          {sent ? (
            <div className="text-center">
              <p className="text-primary/70">
                If an account exists for that email, you&apos;ll receive a reset link shortly.
              </p>
              <p className="mt-2 text-sm text-primary/40">
                In development mode, check your server console for the reset URL.
              </p>
              <Button href="/login" className="mt-6">
                Back to Sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-primary">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
              <p className="text-center text-sm text-primary/60">
                <Link href="/login" className="text-secondary-accent hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
