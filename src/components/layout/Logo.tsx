import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: "dark" | "light";
}

export function Logo({
  className,
  showTagline = false,
  variant = "dark",
}: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-105",
          isLight ? "bg-accent text-primary" : "bg-primary text-background",
        )}
      >
        <span className="font-serif text-xl font-semibold tracking-tight">R</span>
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            "font-serif text-xl font-semibold tracking-tight",
            isLight ? "text-background" : "text-primary",
          )}
        >
          {BRAND.name}
        </span>
        {showTagline && (
          <span
            className={cn(
              "text-xs",
              isLight ? "text-background/60" : "text-primary/60",
            )}
          >
            {BRAND.tagline}
          </span>
        )}
      </div>
    </Link>
  );
}
