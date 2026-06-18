import { getAllUsers } from "@/lib/recipes";
import { UserRoleToggle } from "@/components/admin/UserRoleToggle";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-primary">Users</h1>
      <p className="mt-2 text-primary/60">
        Promote or demote user roles
      </p>

      {users.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-primary/15 bg-white p-12 text-center">
          <p className="text-primary/60">No users yet</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-primary/8 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-primary/8 bg-background">
              <tr>
                <th className="px-6 py-4 font-medium text-primary">Name</th>
                <th className="px-6 py-4 font-medium text-primary">Email</th>
                <th className="px-6 py-4 font-medium text-primary">Joined</th>
                <th className="px-6 py-4 font-medium text-primary">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/8">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-background/50">
                  <td className="px-6 py-4 font-medium text-primary">
                    {user.name ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-primary/60">{user.email}</td>
                  <td className="px-6 py-4 text-primary/50">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <UserRoleToggle user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
