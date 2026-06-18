import Link from "next/link";
import { getTopContributors } from "@/lib/recipes";

export default async function ContributorsPage() {
  const contributors = await getTopContributors(20);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Top Contributors
        </h1>
        <p className="mt-2 text-primary/60">
          The home cooks keeping India&apos;s recipes alive
        </p>
      </div>

      {contributors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-primary/15 bg-white p-16 text-center">
          <p className="text-primary/60">No contributors yet</p>
          <Link
            href="/submit-recipe"
            className="mt-4 inline-block text-sm text-secondary-accent hover:underline"
          >
            Be the first to share →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {contributors.map((contributor, index) => (
            <div
              key={contributor.id}
              className="flex items-center gap-4 rounded-2xl border border-primary/8 bg-white p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 font-semibold text-secondary-accent">
                {index + 1}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-lg font-semibold text-primary">
                {contributor.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1">
                <p className="font-medium text-primary">
                  {contributor.name ?? "Anonymous"}
                </p>
                <p className="text-sm text-primary/50">
                  {contributor._count.recipes} published recipe
                  {contributor._count.recipes !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
