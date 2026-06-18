import Link from "next/link";
import { getAllSubmissions } from "@/lib/recipes";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700",
  PUBLISHED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  DRAFT: "bg-primary/5 text-primary/60",
};

export default async function AdminSubmissionsPage() {
  const submissions = await getAllSubmissions();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-primary">
        Recipe Submissions
      </h1>
      <p className="mt-2 text-primary/60">
        Review natural-language submissions and publish structured recipes.
      </p>

      {submissions.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-primary/15 bg-white p-12 text-center">
          <p className="text-primary/60">No submissions yet</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-primary/8 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/8 bg-background">
              <tr>
                <th className="px-6 py-4 font-medium text-primary">Title</th>
                <th className="px-6 py-4 font-medium text-primary">Submitted by</th>
                <th className="px-6 py-4 font-medium text-primary">Status</th>
                <th className="px-6 py-4 font-medium text-primary">Date</th>
                <th className="px-6 py-4 font-medium text-primary" />
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/8">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-background/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-primary">
                      {sub.title ?? "Untitled"}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-primary/50">
                      {sub.rawContent}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-primary/60">
                    {sub.user.name ?? sub.user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[sub.status]}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-primary/50">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {sub.status === "PENDING" ? (
                      <Link
                        href={`/admin/submissions/${sub.id}`}
                        className="font-medium text-secondary-accent hover:underline"
                      >
                        Review →
                      </Link>
                    ) : sub.publishedRecipe ? (
                      <Link
                        href={`/recipes/${sub.publishedRecipe.slug}`}
                        className="text-primary/50 hover:underline"
                      >
                        View recipe
                      </Link>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
