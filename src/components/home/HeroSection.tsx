"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/recipes?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/recipes");
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(244,163,0,0.12),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(201,106,61,0.08),_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-secondary-accent">
            {BRAND.tagline}
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-primary sm:text-5xl lg:text-6xl">
            {BRAND.heroHeadline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary/70">
            {BRAND.heroSubheadline}
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes, ingredients, states..."
              className="flex-1 rounded-full border border-primary/10 bg-white px-6 py-4 text-sm text-primary shadow-sm outline-none transition-all placeholder:text-primary/40 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/recipes" variant="primary" size="lg">
              {BRAND.primaryCta}
            </Button>
            <Button href="/submit-recipe" variant="outline" size="lg">
              {BRAND.secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
