"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function SubmitRecipeForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || undefined,
          story: story || undefined,
          rawContent,
          imageUrl: imageUrl || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Submission failed");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-primary/8 bg-white p-8 text-center shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-primary">
          Thank you for sharing!
        </h2>
        <p className="mt-4 text-primary/60">
          Your recipe has been submitted for review. Our team will shape it into
          a beautiful published recipe and notify you when it&apos;s live.
        </p>
        <Button href="/recipes" className="mt-6">
          Browse Recipes
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-primary/8 bg-white p-8 shadow-sm"
    >
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-accent/10 p-4 text-sm text-primary/70">
        Write your recipe naturally — like you&apos;d explain it to a friend.
        Hindi, English, or mixed language is welcome. Our team will structure it
        before publishing.
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-primary">
          Recipe name <span className="text-primary/40">(optional)</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Mom's Special Dal Tadka"
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label htmlFor="story" className="mb-1.5 block text-sm font-medium text-primary">
          Story behind the recipe <span className="text-primary/40">(optional)</span>
        </label>
        <textarea
          id="story"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={3}
          placeholder="Who taught you this? When do you make it?"
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label htmlFor="rawContent" className="mb-1.5 block text-sm font-medium text-primary">
          Your recipe <span className="text-secondary-accent">*</span>
        </label>
        <textarea
          id="rawContent"
          value={rawContent}
          onChange={(e) => setRawContent(e.target.value)}
          required
          rows={12}
          placeholder="Tell us everything — ingredients, steps, tips, variations. No strict format needed."
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm leading-relaxed outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="mb-1.5 block text-sm font-medium text-primary">
          Photo URL <span className="text-primary/40">(optional)</span>
        </label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <p className="mt-1 text-xs text-primary/40">
          Image upload via Cloudinary coming soon. Paste a link for now.
        </p>
      </div>

      <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Submitting..." : "Submit for Review"}
      </Button>
    </form>
  );
}
