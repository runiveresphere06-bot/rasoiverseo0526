import { auth } from "@/auth";
import Link from "next/link";
import { getPublishedCommunityPosts } from "@/lib/engagement";
import {
  CommunityFeed,
  CommunityPostForm,
} from "@/components/community/CommunityFeed";

export default async function CommunityPage() {
  const session = await auth();
  const posts = await getPublishedCommunityPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl font-semibold text-primary">
          Community
        </h1>
        <p className="mt-2 text-primary/60">
          Share cooking experiences, tips, and questions with fellow food lovers
        </p>
      </div>

      {session ? (
        <div className="mb-8">
          <CommunityPostForm />
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-primary/8 bg-white p-6 text-center shadow-sm">
          <p className="text-primary/60">
            <Link href="/login" className="font-medium text-secondary-accent hover:underline">
              Sign in
            </Link>{" "}
            to share your cooking stories with the community
          </p>
        </div>
      )}

      <CommunityFeed posts={posts} />
    </div>
  );
}
