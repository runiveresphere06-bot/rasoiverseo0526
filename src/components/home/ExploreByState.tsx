import Link from "next/link";

interface StateItem {
  id: string;
  name: string;
  slug: string;
  _count: { recipes: number };
}

interface ExploreByStateProps {
  states: StateItem[];
}

export function ExploreByState({ states }: ExploreByStateProps) {
  const visibleStates = states.filter((s) => s._count.recipes > 0).slice(0, 12);

  if (visibleStates.length === 0) return null;

  return (
    <section className="border-y border-primary/8 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Explore by State
          </h2>
          <p className="mt-2 text-primary/60">
            Journey through India&apos;s regional cuisines, one state at a time
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibleStates.map((state) => (
            <Link
              key={state.id}
              href={`/states/${state.slug}`}
              className="group rounded-2xl border border-primary/8 bg-background p-5 transition-all hover:border-accent/30 hover:shadow-md"
            >
              <h3 className="font-medium text-primary group-hover:text-secondary-accent">
                {state.name}
              </h3>
              <p className="mt-1 text-sm text-primary/50">
                {state._count.recipes} recipe{state._count.recipes !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/states"
            className="text-sm font-medium text-secondary-accent hover:underline"
          >
            View all states →
          </Link>
        </div>
      </div>
    </section>
  );
}
