import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";

import { findWorkspaceMembershipByUserId } from "../infrastructure/workspace-repository";

export type WorkspaceEntryState =
  | {
      status: "UNAUTHENTICATED";
    }
  | {
      status: "ONBOARDING_REQUIRED";
      userId: string;
    }
  | {
      status: "READY";
      userId: string;
      workspaceId: string;
    };

export async function getWorkspaceEntryState(): Promise<WorkspaceEntryState> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      status: "UNAUTHENTICATED",
    };
  }

  const membership = await findWorkspaceMembershipByUserId(currentUser.id);

  if (!membership) {
    return {
      status: "ONBOARDING_REQUIRED",
      userId: currentUser.id,
    };
  }

  return {
    status: "READY",
    userId: currentUser.id,
    workspaceId: membership.workspaceId,
  };
}
