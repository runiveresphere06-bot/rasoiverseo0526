import Image from "next/image";
import Link from "next/link";
import type { RecipeWithRelations } from "@/lib/recipes";
import { averageRating, formatMinutes } from "@/lib/utils";

interface RecipeCardProps {
  recipe: RecipeWithRelations;
  priority?: boolean;
}

export function RecipeCard({ recipe, priority = false }: RecipeCardProps) {
  const rating = averageRating(recipe.ratings);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-primary/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/30">
            No image
          </div>
        )}
        {recipe.state && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
            {recipe.state.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-serif text-lg font-semibold text-primary transition-colors group-hover:text-secondary-accent">
            {recipe.title}
          </h3>
          {recipe.description && (
            <p className="mt-1 line-clamp-2 text-sm text-primary/60">
              {recipe.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-xs text-primary/50">
          <span>{totalTime > 0 ? formatMinutes(totalTime) : "—"}</span>
          {rating > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-accent">★</span>
              {rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
