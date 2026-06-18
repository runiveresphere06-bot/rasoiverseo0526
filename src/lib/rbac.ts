import type { Role } from "@prisma/client";
import type { Session } from "next-auth";

export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "ADMIN";
}

export function hasRole(session: Session | null, role: Role): boolean {
  return session?.user?.role === role;
}

export function requireAdmin(session: Session | null): void {
  if (!isAdmin(session)) {
    throw new Error("Unauthorized: Admin access required");
  }
}
