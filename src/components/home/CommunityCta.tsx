import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function CommunityCta() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center sm:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,163,0,0.15),_transparent_70%)]" />
          <div className="relative">
            <h2 className="font-serif text-3xl font-semibold text-background sm:text-4xl">
              Share Your Family&apos;s Recipe
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-background/70">
              Every grandmother&apos;s kitchen holds a treasure. Tell us your recipe
              in your own words — we&apos;ll help shape it into something beautiful.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/submit-recipe" variant="primary" size="lg">
                {BRAND.secondaryCta}
              </Button>
              <Button
                href="/community"
                variant="outline"
                size="lg"
                className="border-background/20 text-background hover:bg-background/10"
              >
                Join the Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
