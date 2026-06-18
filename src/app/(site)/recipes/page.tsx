import { Suspense } from "react";
import Link from "next/link";
import {
  searchRecipes,
  getAllStates,
  getAllCategories,
} from "@/lib/recipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeFilters } from "@/components/recipes/RecipeFilters";
import { Button } from "@/components/ui/Button";
import type { RecipeSearchParams } from "@/types/recipe";

interface RecipesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const params = await searchParams;

  const search: RecipeSearchParams = {
    q: params.q,
    state: params.state,
    category: params.category,
    difficulty: params.difficulty as RecipeSearchParams["difficulty"],
    filter: params.filter as RecipeSearchParams["filter"],
    sort: (params.sort as RecipeSearchParams["sort"]) ?? "recent",
    page: params.page ? Number(params.page) : 1,
  };

  const [{ recipes, total, page, totalPages }, states, categories] =
    await Promise.all([
      searchRecipes(search),
      getAllStates(),
      getAllCategories(),
    ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Recipe Library
        </h1>
        <p className="mt-2 text-primary/60">
          {total} authentic Indian recipe{total !== 1 ? "s" : ""} to explore
        </p>
      </div>

      <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-primary/5" />}>
        <RecipeFilters
          states={states.map((s) => ({ slug: s.slug, name: s.name }))}
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        />
      </Suspense>

      {recipes.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-primary/15 bg-white p-16 text-center">
          <p className="text-lg text-primary/60">No recipes found</p>
          <p className="mt-2 text-sm text-primary/40">
            Try adjusting your filters or search terms
          </p>
          <Button href="/recipes" variant="outline" className="mt-6">
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} priority={index < 4} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              {page > 1 && (
                <Link
                  href={`/recipes?${new URLSearchParams({ ...params, page: String(page - 1) } as Record<string, string>).toString()}`}
                  className="rounded-full border border-primary/10 px-4 py-2 text-sm hover:bg-primary/5"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-primary/50">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/recipes?${new URLSearchParams({ ...params, page: String(page + 1) } as Record<string, string>).toString()}`}
                  className="rounded-full border border-primary/10 px-4 py-2 text-sm hover:bg-primary/5"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
