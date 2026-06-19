"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCredentialsLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setFormError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setFormError("Invalid email or password.");
      return;
    }

    window.location.href = callbackUrl;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <h1 className="mt-6 font-serif text-2xl font-semibold text-primary">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-primary/60">
            Sign in to save recipes and share your culinary stories
          </p>
        </div>

        <div className="rounded-2xl border border-primary/8 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              Authentication failed. Please try again.
            </div>
          )}
          {formError && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Continue with Google
          </Button>

          <button
            type="button"
            disabled
            className="mt-3 w-full cursor-not-allowed rounded-full border border-primary/10 px-6 py-3 text-sm font-medium text-primary/40"
          >
            Facebook — Coming Soon
          </button>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-primary/10" />
            <span className="text-xs text-primary/40">or</span>
            <div className="h-px flex-1 bg-primary/10" />
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-primary">
                Email
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
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-primary">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-secondary-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-primary/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-secondary-accent hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
