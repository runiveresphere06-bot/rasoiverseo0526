import Link from "next/link";

interface Contributor {
  id: string;
  name: string | null;
  image: string | null;
  _count: { recipes: number };
}

interface TopContributorsProps {
  contributors: Contributor[];
}

export function TopContributors({ contributors }: TopContributorsProps) {
  if (contributors.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Top Contributors
          </h2>
          <p className="mt-2 text-primary/60">
            The home cooks keeping India&apos;s recipes alive
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {contributors.map((contributor, index) => (
            <div
              key={contributor.id}
              className="flex flex-col items-center rounded-2xl border border-primary/8 bg-white p-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-lg font-semibold text-secondary-accent">
                {contributor.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <h3 className="mt-3 font-medium text-primary">
                {contributor.name ?? "Anonymous"}
              </h3>
              <p className="text-sm text-primary/50">
                {contributor._count.recipes} recipes
              </p>
              {index === 0 && (
                <span className="mt-2 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-secondary-accent">
                  #1
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/contributors"
            className="text-sm font-medium text-secondary-accent hover:underline"
          >
            Meet all contributors →
          </Link>
        </div>
      </div>
    </section>
  );
}
