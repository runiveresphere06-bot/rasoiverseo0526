"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CommunityPostWithUser } from "@/lib/engagement";
import { Button } from "@/components/ui/Button";

export function CommunityFeed({ posts }: { posts: CommunityPostWithUser[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-primary/15 bg-white p-16 text-center">
        <p className="text-primary/60">No community posts yet.</p>
        <p className="mt-2 text-sm text-primary/40">Be the first to share your cooking story!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 font-semibold text-secondary-accent">
              {post.user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-medium text-primary">{post.user.name ?? "Anonymous"}</p>
              <p className="text-xs text-primary/40">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {post.title && (
            <h2 className="mt-4 font-serif text-xl font-semibold text-primary">
              {post.title}
            </h2>
          )}

          <p className="mt-3 whitespace-pre-wrap leading-relaxed text-primary/80">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="relative mt-4 aspect-video overflow-hidden rounded-xl">
              <Image
                src={post.imageUrl}
                alt={post.title ?? "Community post"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
            </div>
          )}

          {post.recipe && (
            <Link
              href={`/recipes/${post.recipe.slug}`}
              className="mt-4 inline-block text-sm text-secondary-accent hover:underline"
            >
              Related: {post.recipe.title} →
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}

export function CommunityPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || undefined,
          content,
          imageUrl: imageUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to post");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-primary/8 bg-white p-8 text-center shadow-sm">
        <h3 className="font-serif text-xl font-semibold text-primary">Post submitted!</h3>
        <p className="mt-2 text-sm text-primary/60">
          Your post will appear in the community once approved by our team.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-primary/8 bg-white p-6 shadow-sm"
    >
      <h3 className="font-semibold text-primary">Share with the community</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={5}
        placeholder="Share a cooking tip, experience, or question..."
        className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
      />

      <input
        type="url"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Photo URL (optional)"
        className="w-full rounded-xl border border-primary/10 px-4 py-3 text-sm outline-none focus:border-accent"
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit for Review"}
      </Button>
    </form>
  );
}
