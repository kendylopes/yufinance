import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageCategories } from "../domain/category-permissions";
import { archiveActiveCategoryRecord } from "../infrastructure/category-repository";

export type ArchiveCategoryResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function archiveCategory(input: {
  workspaceId: string;
  categoryId: string;
}): Promise<ArchiveCategoryResult> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    };
  }

  const membership = await findWorkspaceMembership(currentUser.id, input.workspaceId);

  if (!membership) {
    return {
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    };
  }

  if (!canManageCategories(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para arquivar categorias.",
    };
  }

  try {
    const category = await archiveActiveCategoryRecord({
      workspaceId: input.workspaceId,
      categoryId: input.categoryId,
    });

    if (!category) {
      return {
        success: false,
        message: "Categoria não encontrada.",
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível arquivar a categoria. Tente novamente.",
    };
  }
}
