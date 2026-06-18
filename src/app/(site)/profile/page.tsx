import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserProfile, getUserFavorites } from "@/lib/engagement";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Button } from "@/components/ui/Button";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/profile");

  const [profile, favorites] = await Promise.all([
    getUserProfile(session.user.id),
    getUserFavorites(session.user.id),
  ]);

  if (!profile) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="rounded-2xl border border-primary/8 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-2xl font-semibold text-secondary-accent">
            {profile.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-primary">
              {profile.name ?? "Your Profile"}
            </h1>
            <p className="text-sm text-primary/50">{profile.email}</p>
            <p className="text-xs text-primary/40">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Saved" value={profile._count.favorites} />
          <Stat label="Comments" value={profile._count.comments} />
          <Stat label="Submissions" value={profile._count.submissions} />
          <Stat label="Posts" value={profile._count.communityPosts} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/submit-recipe" size="sm">
            Share a Recipe
          </Button>
          <Button href="/community" variant="outline" size="sm">
            Community
          </Button>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-semibold text-primary">
          Saved Recipes
        </h2>
        {favorites.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-primary/15 bg-white p-12 text-center">
            <p className="text-primary/60">No saved recipes yet</p>
            <Link
              href="/recipes"
              className="mt-2 inline-block text-sm text-secondary-accent hover:underline"
            >
              Explore recipes →
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {favorites.map(({ recipe }) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-background p-4 text-center">
      <p className="font-serif text-2xl font-semibold text-primary">{value}</p>
      <p className="text-xs text-primary/50">{label}</p>
    </div>
  );
}
