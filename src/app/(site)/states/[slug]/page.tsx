import Link from "next/link";
import { notFound } from "next/navigation";
import { getStateBySlug, searchRecipes } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";

interface StatePageProps {
  params: Promise<{ slug: string }>;
}

export default async function StateDetailPage({ params }: StatePageProps) {
  const { slug } = await params;
  const state = await getStateBySlug(slug);

  if (!state) notFound();

  const { recipes, total } = await searchRecipes({ state: slug, limit: 24 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-10">
        <Link href="/states" className="text-sm text-secondary-accent hover:underline">
          ← All states
        </Link>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-primary">
          {state.name}
        </h1>
        <p className="mt-2 text-primary/60">
          {state.description ?? `Recipes from ${state.name}`}
        </p>
        <p className="mt-1 text-sm text-primary/40">
          {total} recipe{total !== 1 ? "s" : ""}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/15 bg-white p-16 text-center">
          <p className="text-primary/60">No recipes from this state yet.</p>
          <Link href="/submit-recipe" className="mt-4 inline-block text-sm text-secondary-accent hover:underline">
            Share a recipe from {state.name}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
