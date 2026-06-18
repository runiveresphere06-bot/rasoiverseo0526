import Link from "next/link";
import { getAllFestivals, searchRecipes } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";

export default async function FestivalsPage() {
  const festivals = await getAllFestivals();

  const festivalsWithRecipes = await Promise.all(
    festivals.map(async (festival) => {
      const { recipes, total } = await searchRecipes({
        festival: festival.slug,
        limit: 4,
      });
      return { festival, recipes, total };
    }),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Festival Specials
        </h1>
        <p className="mt-2 text-primary/60">
          Traditional dishes for India&apos;s celebrations
        </p>
      </div>

      <div className="space-y-16">
        {festivalsWithRecipes.map(({ festival, recipes, total }) => (
          <section key={festival.id}>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-primary">
                  {festival.name}
                </h2>
                {festival.description && (
                  <p className="mt-1 text-primary/60">{festival.description}</p>
                )}
                <p className="mt-1 text-sm text-primary/40">
                  {total} recipe{total !== 1 ? "s" : ""}
                </p>
              </div>
              {total > 0 && (
                <Link
                  href={`/recipes?festival=${festival.slug}`}
                  className="text-sm text-secondary-accent hover:underline"
                >
                  View all →
                </Link>
              )}
            </div>

            {recipes.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-primary/40">No recipes yet for this festival.</p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
