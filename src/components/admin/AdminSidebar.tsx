"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Overview", icon: "◉" },
  { href: "/admin/submissions", label: "Submissions", icon: "✎" },
  { href: "/admin/recipes", label: "Recipes", icon: "◎" },
  { href: "/admin/users", label: "Users", icon: "◌" },
  { href: "/admin/comments", label: "Comments", icon: "◇" },
  { href: "/admin/community", label: "Community", icon: "◈" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-primary/8 bg-white">
      <div className="border-b border-primary/8 px-6 py-5">
        <Link href="/admin" className="font-serif text-lg font-semibold text-primary">
          Admin Panel
        </Link>
        <p className="text-xs text-primary/50">RasoiVerse Management</p>
      </div>

      <nav className="space-y-1 p-4">
        {adminNav.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/15 text-primary"
                  : "text-primary/60 hover:bg-primary/5 hover:text-primary",
              )}
            >
              <span className="text-xs opacity-60">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-primary/8 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-primary/60 hover:bg-primary/5 hover:text-primary"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
