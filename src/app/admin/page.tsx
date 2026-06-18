import Link from "next/link";
import {
  getAdminStats,
  getPendingSubmissions,
  getRecentUsers,
} from "@/lib/recipes";
import { StatCard } from "@/components/admin/StatCard";

export default async function AdminDashboardPage() {
  const [stats, pendingSubmissions, recentUsers] = await Promise.all([
    getAdminStats(),
    getPendingSubmissions(5),
    getRecentUsers(5),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-primary">
          Dashboard
        </h1>
        <p className="mt-1 text-primary/60">
          Overview of RasoiVerse platform activity
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Published Recipes" value={stats.publishedRecipes} />
        <StatCard label="Total Recipes" value={stats.totalRecipes} />
        <StatCard
          label="Pending Submissions"
          value={stats.pendingSubmissions}
          hint="Awaiting review"
        />
        <StatCard label="Users" value={stats.totalUsers} />
        <StatCard label="Comments" value={stats.totalComments} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-primary">Pending Submissions</h2>
            <Link
              href="/admin/submissions"
              className="text-sm text-secondary-accent hover:underline"
            >
              View all
            </Link>
          </div>
          {pendingSubmissions.length === 0 ? (
            <p className="text-sm text-primary/50">No pending submissions</p>
          ) : (
            <ul className="space-y-3">
              {pendingSubmissions.map((submission) => (
                <li
                  key={submission.id}
                  className="rounded-xl border border-primary/8 p-4"
                >
                  <p className="font-medium text-primary">
                    {submission.title ?? "Untitled submission"}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-primary/60">
                    {submission.rawContent}
                  </p>
                  <p className="mt-2 text-xs text-primary/40">
                    by {submission.user.name ?? submission.user.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-primary/8 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-primary">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-secondary-accent hover:underline"
            >
              Manage users
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-primary/50">No users yet</p>
          ) : (
            <ul className="space-y-3">
              {recentUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between rounded-xl border border-primary/8 p-4"
                >
                  <div>
                    <p className="font-medium text-primary">
                      {user.name ?? "Unnamed"}
                    </p>
                    <p className="text-sm text-primary/50">{user.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === "ADMIN"
                        ? "bg-accent/15 text-secondary-accent"
                        : "bg-primary/5 text-primary/60"
                    }`}
                  >
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-dashed border-primary/15 bg-primary/2 p-8 text-center">
        <h2 className="font-semibold text-primary">Phase 1 Foundation</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-primary/60">
          Recipe editing, submission approval workflow, user role management, and
          analytics will be expanded in upcoming phases.
        </p>
      </section>
    </div>
  );
}
