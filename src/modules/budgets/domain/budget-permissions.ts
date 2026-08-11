import type { workspaceRoleEnum } from "@/db/schema/core/enums";

type WorkspaceRole = (typeof workspaceRoleEnum.enumValues)[number];

export function canReadBudgets(role: WorkspaceRole): boolean {
  return ["OWNER", "ADMIN", "MEMBER", "VIEWER"].includes(role);
}

export function canManageBudgets(role: WorkspaceRole): boolean {
  return role === "OWNER" || role === "ADMIN";
}
