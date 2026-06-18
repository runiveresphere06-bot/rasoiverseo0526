import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getSubmissionById,
  getAllStates,
  getAllCategories,
  getAllFestivals,
} from "@/lib/recipes";
import { AdminSubmissionEditor } from "@/components/admin/AdminSubmissionEditor";

interface SubmissionReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionReviewPage({
  params,
}: SubmissionReviewPageProps) {
  const { id } = await params;
  const submission = await getSubmissionById(id);

  if (!submission) notFound();

  if (submission.status !== "PENDING") {
    redirect("/admin/submissions");
  }

  const [states, categories, festivals] = await Promise.all([
    getAllStates(),
    getAllCategories(),
    getAllFestivals(),
  ]);

  return (
    <div>
      <Link
        href="/admin/submissions"
        className="text-sm text-secondary-accent hover:underline"
      >
        ← Back to submissions
      </Link>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-primary">
        Review Submission
      </h1>
      <p className="mt-1 text-primary/60">
        Structure and publish this recipe to RasoiVerse
      </p>

      <div className="mt-8">
        <AdminSubmissionEditor
          submission={{
            id: submission.id,
            rawContent: submission.rawContent,
            title: submission.title,
            story: submission.story,
            imageUrl: submission.imageUrl,
            user: submission.user,
          }}
          states={states.map((s) => ({ id: s.id, name: s.name }))}
          categories={categories.map((c) => ({ id: c.id, name: c.name }))}
          festivals={festivals.map((f) => ({ id: f.id, name: f.name }))}
        />
      </div>
    </div>
  );
}
