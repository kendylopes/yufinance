"use server";

import {
  type CreateInitialWorkspaceResult,
  createInitialWorkspace,
} from "../application/create-initial-workspace";
import type { CreateInitialWorkspaceInput } from "../application/create-initial-workspace.schema";

export async function createInitialWorkspaceAction(
  input: CreateInitialWorkspaceInput,
): Promise<CreateInitialWorkspaceResult> {
  return createInitialWorkspace(input);
}
