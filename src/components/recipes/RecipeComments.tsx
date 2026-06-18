"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string | null; image: string | null };
}

interface RecipeCommentsProps {
  slug: string;
  initialComments: Comment[];
}

export function RecipeComments({ slug, initialComments }: RecipeCommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/recipes/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to post");
        return;
      }
      setComments([data.comment, ...comments]);
      setContent("");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-xl font-semibold text-primary">
        Comments ({comments.length})
      </h2>

      {session ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience cooking this recipe..."
            rows={3}
            className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <Button type="submit" size="sm" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Post comment"}
          </Button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-primary/60">
          <Link href="/login" className="text-secondary-accent hover:underline">
            Sign in
          </Link>{" "}
          to join the conversation
        </p>
      )}

      <ul className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <li className="text-sm text-primary/40">No comments yet. Be the first!</li>
        ) : (
          comments.map((comment) => (
            <li key={comment.id} className="border-t border-primary/8 pt-4 first:border-0 first:pt-0">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-secondary-accent">
                  {comment.user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">
                    {comment.user.name ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-primary/40">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-primary/80">
                {comment.content}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
