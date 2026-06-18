import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-primary/8 bg-white px-8 py-4">
          <p className="text-sm text-primary/60">
            Signed in as{" "}
            <span className="font-medium text-primary">
              {session.user.name ?? session.user.email}
            </span>
          </p>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
