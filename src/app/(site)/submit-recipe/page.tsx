import { SubmitRecipeForm } from "@/components/recipes/SubmitRecipeForm";

export default function SubmitRecipePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Share Your Recipe
        </h1>
        <p className="mt-2 text-primary/60">
          Tell us your recipe in your own words. We&apos;ll shape it into something beautiful.
        </p>
      </div>

      <SubmitRecipeForm />
    </div>
  );
}
