import { Button } from "@/components/ui/Button";

export function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-4xl font-semibold text-primary">{title}</h1>
      <p className="mt-4 text-lg text-primary/60">{description}</p>
      <p className="mt-2 text-sm text-primary/40">Coming in Phase 2</p>
      <Button href="/" className="mt-8">
        Back to Home
      </Button>
    </div>
  );
}
