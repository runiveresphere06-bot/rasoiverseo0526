import { getAllCommunityPostsAdmin } from "@/lib/engagement";
import { CommunityModeration } from "@/components/admin/ModerationActions";

const STATUS_STYLES = {
  PENDING: "bg-amber-50 text-amber-700",
  PUBLISHED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default async function AdminCommunityPage() {
  const posts = await getAllCommunityPostsAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-primary">
        Community Posts
      </h1>
      <p className="mt-2 text-primary/60">Moderate community discussions and photos</p>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-primary/15 bg-white p-12 text-center">
          <p className="text-primary/60">No community posts yet</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-primary">
                    {post.title ?? "Untitled post"}
                  </p>
                  <p className="text-xs text-primary/40">
                    by {post.user.name ?? post.user.email} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[post.status]}`}
                  >
                    {post.status}
                  </span>
                </div>
                <CommunityModeration postId={post.id} status={post.status} />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-primary/80">
                {post.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
