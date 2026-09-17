import type { Role } from "@/lib/session";

export type Permission = "phrase:read" | "phrase:create" | "phrase:publish" | "member:manage" | "audit:read" | "apikey:manage" | "billing:manage";

const rolePermissions: Record<Role, ReadonlySet<Permission>> = {
  OWNER: new Set(["phrase:read", "phrase:create", "phrase:publish", "member:manage", "audit:read", "apikey:manage", "billing:manage"]),
  ADMIN: new Set(["phrase:read", "phrase:create", "phrase:publish", "member:manage", "audit:read", "apikey:manage"]),
  EDITOR: new Set(["phrase:read", "phrase:create", "phrase:publish"]),
  VIEWER: new Set(["phrase:read"]),
};

export function can(role: Role, permission: Permission) {
  return rolePermissions[role].has(permission);
}

export function assertPermission(role: Role, permission: Permission) {
  if (!can(role, permission)) throw new Error("FORBIDDEN");
}
