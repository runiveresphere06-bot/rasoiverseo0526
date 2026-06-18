import Link from "next/link";
import { getAllStates } from "@/lib/recipes";

export default async function StatesPage() {
  const states = await getAllStates();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Explore by State
        </h1>
        <p className="mt-2 text-primary/60">
          Journey through India&apos;s regional cuisines
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {states.map((state) => (
          <Link
            key={state.id}
            href={`/states/${state.slug}`}
            className="group rounded-2xl border border-primary/8 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="font-medium text-primary group-hover:text-secondary-accent">
              {state.name}
            </h2>
            <p className="mt-1 text-sm text-primary/50">
              {state._count.recipes} recipe{state._count.recipes !== 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
