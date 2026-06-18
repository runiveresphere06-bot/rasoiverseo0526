"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Reset failed");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-primary/70">Invalid reset link.</p>
        <Button href="/forgot-password" className="mt-4">
          Request new link
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <p className="text-primary/70">Your password has been updated.</p>
        <Button href="/login" className="mt-4">
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-primary">
          New password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <div>
        <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-primary">
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-6 font-serif text-2xl font-semibold text-primary">
            Set new password
          </h1>
        </div>
        <div className="rounded-2xl border border-primary/8 bg-white p-8 shadow-sm">
          <Suspense fallback={<p className="text-center text-primary/60">Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-primary/60">
            <Link href="/login" className="text-secondary-accent hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
