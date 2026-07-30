import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageCategories } from "../domain/category-permissions";
import { restoreArchivedCategoryRecord } from "../infrastructure/category-repository";

export type RestoreCategoryResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function restoreCategory(input: {
  workspaceId: string;
  categoryId: string;
}): Promise<RestoreCategoryResult> {
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
      message: "Você não possui permissão para restaurar categorias.",
    };
  }

  try {
    const category = await restoreArchivedCategoryRecord({
      workspaceId: input.workspaceId,
      categoryId: input.categoryId,
    });

    if (!category) {
      return {
        success: false,
        message: "Categoria arquivada não encontrada.",
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível restaurar a categoria. Tente novamente.",
    };
  }
}
