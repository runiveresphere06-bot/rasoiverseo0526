"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";

interface RecipeFiltersProps {
  states: { slug: string; name: string }[];
  categories: { slug: string; name: string }[];
}

export function RecipeFilters({ states, categories }: RecipeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const state = searchParams.get("state") ?? "";
  const category = searchParams.get("category") ?? "";
  const difficulty = searchParams.get("difficulty") ?? "";
  const sort = searchParams.get("sort") ?? "recent";

  function applyFilters(overrides: Record<string, string> = {}) {
    const params = new URLSearchParams();
    const values = {
      q,
      state,
      category,
      difficulty,
      sort,
      ...overrides,
    };

    Object.entries(values).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    startTransition(() => {
      router.push(`/recipes?${params.toString()}`);
    });
  }

  return (
    <div className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="search" className="mb-1.5 block text-sm font-medium text-primary">
            Search
          </label>
          <input
            id="search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Recipe name, ingredient..."
            className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-primary">
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => applyFilters({ state: e.target.value })}
              className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
            >
              <option value="">All states</option>
              {states.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-primary">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => applyFilters({ category: e.target.value })}
              className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="mb-1.5 block text-sm font-medium text-primary">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => applyFilters({ difficulty: e.target.value })}
              className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
            >
              <option value="">Any</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sort}
            onChange={(e) => applyFilters({ sort: e.target.value })}
            className="rounded-full border border-primary/10 px-4 py-2 text-sm outline-none"
          >
            <option value="recent">Most recent</option>
            <option value="popular">Most popular</option>
          </select>

          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Searching..." : "Search"}
          </Button>

          {(q || state || category || difficulty) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setQ("");
                startTransition(() => router.push("/recipes"));
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
