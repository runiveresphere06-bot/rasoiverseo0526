import { getAllCommentsAdmin } from "@/lib/engagement";
import { CommentModeration } from "@/components/admin/ModerationActions";
import Link from "next/link";

export default async function AdminCommentsPage() {
  const comments = await getAllCommentsAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-primary">Comments</h1>
      <p className="mt-2 text-primary/60">Moderate recipe comments</p>

      {comments.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-primary/15 bg-white p-12 text-center">
          <p className="text-primary/60">No comments yet</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm ${
                comment.isHidden ? "border-red-200 opacity-60" : "border-primary/8"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-primary">
                    {comment.user.name ?? comment.user.email}
                  </p>
                  <p className="text-xs text-primary/40">
                    on{" "}
                    <Link
                      href={`/recipes/${comment.recipe.slug}`}
                      className="text-secondary-accent hover:underline"
                    >
                      {comment.recipe.title}
                    </Link>
                    {" · "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                    {comment.isHidden && (
                      <span className="ml-2 text-red-600">(hidden)</span>
                    )}
                  </p>
                </div>
                <CommentModeration
                  commentId={comment.id}
                  isHidden={comment.isHidden}
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-primary/80">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
