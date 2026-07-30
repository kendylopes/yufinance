import "server-only";

import type { CreateInitialWorkspaceData } from "../application/create-initial-workspace.schema";
import {
  createInitialWorkspaceRecords,
  findWorkspaceMembershipByUserId,
} from "./workspace-repository";

type CreateInitialWorkspacePersistenceInput = {
  userId: string;
  workspace: CreateInitialWorkspaceData;
};

export async function persistInitialWorkspace({
  userId,
  workspace,
}: CreateInitialWorkspacePersistenceInput) {
  const existingMembership = await findWorkspaceMembershipByUserId(userId);

  if (existingMembership) {
    return {
      success: false as const,
      reason: "WORKSPACE_ALREADY_EXISTS" as const,
    };
  }

  const workspaceId = crypto.randomUUID();

  await createInitialWorkspaceRecords({
    workspaceId,
    userId,
    workspace,
  });

  return {
    success: true as const,
    workspaceId,
  };
}
