import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";

const footerLinks = {
  explore: [
    { href: "/recipes", label: "All Recipes" },
    { href: "/states", label: "Browse by State" },
    { href: "/categories", label: "Categories" },
    { href: "/festivals", label: "Festival Specials" },
  ],
  community: [
    { href: "/submit-recipe", label: "Share a Recipe" },
    { href: "/community", label: "Discussions" },
    { href: "/contributors", label: "Top Contributors" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Contact" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-primary/8 bg-primary text-background">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo variant="light" />
            <p className="max-w-xs text-sm leading-relaxed text-background/70">
              {BRAND.metaDescription}
            </p>
            <p className="text-xs text-background/50">{BRAND.tagline}</p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/90">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/60 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 sm:flex-row">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} {BRAND.name}. Preserving India&apos;s culinary heritage.
          </p>
          <p className="text-sm text-background/50">Made with love for Indian food culture.</p>
        </div>
      </div>
    </footer>
  );
}
