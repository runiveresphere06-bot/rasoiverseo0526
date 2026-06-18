import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getRecipeBySlug,
  incrementRecipeViews,
} from "@/lib/recipes";
import {
  getRecipeEngagement,
  getRecipeComments,
} from "@/lib/engagement";
import { RecipeAudioPlayer } from "@/components/recipes/RecipeAudioPlayer";
import { RecipeEngagement } from "@/components/recipes/RecipeEngagement";
import { RecipeComments } from "@/components/recipes/RecipeComments";
import { averageRating, formatMinutes } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import type { Ingredient, Instruction } from "@/types/recipe";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) return { title: "Recipe Not Found" };

  return {
    title: recipe.seoTitle ?? `${recipe.title} | ${BRAND.name}`,
    description: recipe.seoDescription ?? recipe.description ?? undefined,
    openGraph: {
      title: recipe.title,
      description: recipe.description ?? undefined,
      images: recipe.imageUrl ? [{ url: recipe.imageUrl }] : undefined,
    },
  };
}

export default async function RecipeDetailPage({ params }: RecipePageProps) {
  const { slug } = await params;
  const session = await auth();
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) notFound();

  await incrementRecipeViews(recipe.id);

  const [engagement, comments] = await Promise.all([
    getRecipeEngagement(recipe.id, session?.user?.id),
    getRecipeComments(recipe.id),
  ]);

  const ingredients = recipe.ingredients as Ingredient[];
  const instructions = recipe.instructions as Instruction[];
  const rating = averageRating(recipe.ratings);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    image: recipe.imageUrl,
    author: recipe.author?.name
      ? { "@type": "Person", name: recipe.author.name }
      : undefined,
    prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
    cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    recipeIngredient: ingredients.map((i) => `${i.amount} ${i.item}`),
    recipeInstructions: instructions.map((s) => ({
      "@type": "HowToStep",
      text: s.text,
      position: s.step,
    })),
    aggregateRating:
      recipe.ratings.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: rating,
            ratingCount: recipe.ratings.length,
          }
        : undefined,
  };

  return (
    <article className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {recipe.imageUrl && (
        <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-3xl bg-primary/5">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      <header>
        <div className="flex flex-wrap items-center gap-3 text-sm text-primary/50">
          {recipe.state && (
            <Link
              href={`/states/${recipe.state.slug}`}
              className="rounded-full bg-accent/15 px-3 py-1 font-medium text-secondary-accent hover:bg-accent/25"
            >
              {recipe.state.name}
            </Link>
          )}
          <span className="capitalize">{recipe.difficulty.toLowerCase()}</span>
          {totalTime > 0 && <span>{formatMinutes(totalTime)}</span>}
          {rating > 0 && <span className="text-accent">★ {rating}</span>}
        </div>

        <h1 className="mt-4 font-serif text-4xl font-semibold text-primary sm:text-5xl">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="mt-4 text-lg leading-relaxed text-primary/70">
            {recipe.description}
          </p>
        )}

        {recipe.author?.name && (
          <p className="mt-4 text-sm text-primary/50">By {recipe.author.name}</p>
        )}
      </header>

      <div className="mt-6">
        <RecipeEngagement
          slug={slug}
          initialFavorited={engagement.isFavorited}
          initialUserRating={engagement.userRating}
          initialAverage={rating}
          favoriteCount={engagement.favoriteCount}
        />
      </div>

      {recipe.story && (
        <section className="mt-8 rounded-2xl border border-primary/8 bg-white p-6">
          <h2 className="font-serif text-xl font-semibold text-primary">The Story</h2>
          <p className="mt-3 leading-relaxed text-primary/70">{recipe.story}</p>
        </section>
      )}

      {recipe.audioTracks.length > 0 && (
        <div className="mt-8">
          <RecipeAudioPlayer tracks={recipe.audioTracks} />
        </div>
      )}

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-primary">Ingredients</h2>
          {recipe.servings && (
            <p className="mt-1 text-sm text-primary/50">Serves {recipe.servings}</p>
          )}
          <ul className="mt-4 space-y-2">
            {ingredients.map((ing, idx) => (
              <li key={idx} className="flex justify-between gap-4 text-sm">
                <span className="text-primary">{ing.item}</span>
                <span className="text-primary/50">{ing.amount}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-primary">Instructions</h2>
          <ol className="mt-4 space-y-4">
            {instructions.map((step) => (
              <li key={step.step} className="flex gap-4 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-secondary-accent">
                  {step.step}
                </span>
                <p className="leading-relaxed text-primary/80">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {recipe.categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {recipe.categories.map(({ category }) => (
            <Link
              key={category.id}
              href={`/recipes?category=${category.slug}`}
              className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary/60 hover:bg-primary/10"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      <RecipeComments
        slug={slug}
        initialComments={comments.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
        }))}
      />
    </article>
  );
}
