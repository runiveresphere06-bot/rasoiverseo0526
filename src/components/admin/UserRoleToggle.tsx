"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserRowProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: "USER" | "ADMIN";
  };
}

export function UserRoleToggle({ user }: UserRowProps) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  async function handleChange(newRole: "USER" | "ADMIN") {
    if (newRole === role) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setRole(newRole);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={role}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value as "USER" | "ADMIN")}
      className="rounded-lg border border-primary/10 px-3 py-1.5 text-sm outline-none disabled:opacity-50"
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
