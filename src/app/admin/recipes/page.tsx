import Link from "next/link";
import { getAllPublishedRecipesAdmin } from "@/lib/recipes";

const STATUS_STYLES = {
  PUBLISHED: "bg-green-50 text-green-700",
  DRAFT: "bg-primary/5 text-primary/60",
  PENDING: "bg-amber-50 text-amber-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default async function AdminRecipesPage() {
  const recipes = await getAllPublishedRecipesAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-primary">Recipes</h1>
      <p className="mt-2 text-primary/60">
        Manage published recipes and audio tracks
      </p>

      {recipes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-primary/15 bg-white p-12 text-center">
          <p className="text-primary/60">No recipes yet</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-primary/8 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/8 bg-background">
              <tr>
                <th className="px-6 py-4 font-medium text-primary">Title</th>
                <th className="px-6 py-4 font-medium text-primary">State</th>
                <th className="px-6 py-4 font-medium text-primary">Status</th>
                <th className="px-6 py-4 font-medium text-primary">Audio</th>
                <th className="px-6 py-4 font-medium text-primary">Views</th>
                <th className="px-6 py-4 font-medium text-primary" />
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/8">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-primary">{recipe.title}</p>
                    <p className="text-xs text-primary/40">
                      by {recipe.author.name ?? recipe.author.email}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-primary/60">
                    {recipe.state?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[recipe.status]}`}
                    >
                      {recipe.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/50">
                    {recipe.audioTracks.length > 0
                      ? `${recipe.audioTracks.length} track(s)`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-primary/50">{recipe.viewCount}</td>
                  <td className="px-6 py-4">
                    {recipe.status === "PUBLISHED" && (
                      <Link
                        href={`/recipes/${recipe.slug}`}
                        className="font-medium text-secondary-accent hover:underline"
                      >
                        View →
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-sm text-primary/40">
        Audio upload management via Cloudinary — coming in next update.
      </p>
    </div>
  );
}
