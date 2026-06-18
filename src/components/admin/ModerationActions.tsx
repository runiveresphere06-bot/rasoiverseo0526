"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CommentModerationProps {
  commentId: string;
  isHidden: boolean;
}

export function CommentModeration({ commentId, isHidden }: CommentModerationProps) {
  const router = useRouter();
  const [hidden, setHidden] = useState(isHidden);
  const [loading, setLoading] = useState(false);

  async function toggleHide() {
    setLoading(true);
    await fetch(`/api/admin/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: !hidden }),
    });
    setHidden(!hidden);
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this comment permanently?")) return;
    setLoading(true);
    await fetch(`/api/admin/comments/${commentId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={toggleHide}
        className="text-xs font-medium text-secondary-accent hover:underline disabled:opacity-50"
      >
        {hidden ? "Unhide" : "Hide"}
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={handleDelete}
        className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}

interface CommunityModerationProps {
  postId: string;
  status: string;
}

export function CommunityModeration({ postId, status }: CommunityModerationProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status !== "PENDING") return null;

  async function approve() {
    setLoading(true);
    await fetch(`/api/admin/community/${postId}/approve`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  async function reject() {
    if (!confirm("Reject this post?")) return;
    setLoading(true);
    await fetch(`/api/admin/community/${postId}/reject`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={approve}
        className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={reject}
        className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
