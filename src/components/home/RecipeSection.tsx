import Link from "next/link";
import type { RecipeWithRelations } from "@/lib/recipes";
import { RecipeCard } from "@/components/recipes/RecipeCard";

interface RecipeSectionProps {
  title: string;
  subtitle?: string;
  recipes: RecipeWithRelations[];
  viewAllHref?: string;
}

export function RecipeSection({
  title,
  subtitle,
  recipes,
  viewAllHref,
}: RecipeSectionProps) {
  if (recipes.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-primary">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-primary/60">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-sm font-medium text-secondary-accent hover:underline"
            >
              View all →
            </Link>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recipes.map((recipe, index) => (
            <RecipeCard key={recipe.id} recipe={recipe} priority={index < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
