"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/recipes", label: "Recipes" },
  { href: "/states", label: "By State" },
  { href: "/community", label: "Community" },
  { href: "/submit-recipe", label: "Share Recipe" },
];

export function Header() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-primary/8 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-primary/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-secondary-accent transition-colors hover:text-secondary-accent/80"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className={cn(
                  "hidden text-sm font-medium text-primary/70 hover:text-primary sm:block",
                )}
              >
                {session.user?.name ?? "Profile"}
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button href="/register" variant="primary" size="sm">
                Join
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
