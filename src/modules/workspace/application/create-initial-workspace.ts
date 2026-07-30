import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";

import { persistInitialWorkspace } from "../infrastructure/create-initial-workspace";
import {
  type CreateInitialWorkspaceInput,
  createInitialWorkspaceSchema,
} from "./create-initial-workspace.schema";

export type CreateInitialWorkspaceResult =
  | {
      success: true;
      workspaceId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createInitialWorkspace(
  input: CreateInitialWorkspaceInput,
): Promise<CreateInitialWorkspaceResult> {
  const validation = createInitialWorkspaceSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: "Os dados informados não são válidos.",
    };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    };
  }

  try {
    const result = await persistInitialWorkspace({
      userId: currentUser.id,
      workspace: validation.data,
    });

    if (!result.success) {
      return {
        success: false,
        message: "Seu espaço financeiro inicial já foi configurado.",
      };
    }

    return {
      success: true,
      workspaceId: result.workspaceId,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível configurar seu espaço financeiro. Tente novamente.",
    };
  }
}
