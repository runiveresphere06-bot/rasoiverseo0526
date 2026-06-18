"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface RecipeEngagementProps {
  slug: string;
  initialFavorited: boolean;
  initialUserRating: number | null;
  initialAverage: number;
  favoriteCount: number;
}

export function RecipeEngagement({
  slug,
  initialFavorited,
  initialUserRating,
  initialAverage,
  favoriteCount,
}: RecipeEngagementProps) {
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [userRating, setUserRating] = useState(initialUserRating);
  const [average, setAverage] = useState(initialAverage);
  const [saves, setSaves] = useState(favoriteCount);
  const [loading, setLoading] = useState(false);

  async function toggleFavorite() {
    if (!session) return;
    setLoading(true);
    const method = favorited ? "DELETE" : "POST";
    const res = await fetch(`/api/recipes/${slug}/favorite`, { method });
    if (res.ok) {
      setFavorited(!favorited);
      setSaves((c) => (favorited ? c - 1 : c + 1));
    }
    setLoading(false);
  }

  async function rate(value: number) {
    if (!session) return;
    setLoading(true);
    const res = await fetch(`/api/recipes/${slug}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (res.ok) {
      const data = await res.json();
      setUserRating(value);
      setAverage(data.average);
    }
    setLoading(false);
  }

  if (!session) {
    return (
      <div className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
        <p className="text-sm text-primary/60">
          <Link href="/login" className="font-medium text-secondary-accent hover:underline">
            Sign in
          </Link>{" "}
          to save and rate this recipe
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={loading}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          favorited
            ? "bg-accent text-primary"
            : "border border-primary/10 text-primary hover:bg-primary/5"
        }`}
      >
        {favorited ? "♥ Saved" : "♡ Save"}
        {saves > 0 && <span className="text-primary/50">({saves})</span>}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-primary/60">Rate:</span>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={loading}
            onClick={() => rate(star)}
            className={`text-lg transition-colors ${
              (userRating ?? 0) >= star ? "text-accent" : "text-primary/20 hover:text-accent/60"
            }`}
            aria-label={`Rate ${star} stars`}
          >
            ★
          </button>
        ))}
        {average > 0 && (
          <span className="ml-2 text-sm text-primary/50">{average} avg</span>
        )}
      </div>
    </div>
  );
}
