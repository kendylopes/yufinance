export type CategoryRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export function canReadCategories(role: CategoryRole): boolean {
  return role === "OWNER" || role === "ADMIN" || role === "MEMBER" || role === "VIEWER";
}

export function canManageCategories(role: CategoryRole): boolean {
  return role === "OWNER" || role === "ADMIN";
}
