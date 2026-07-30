import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadCategories } from "../domain/category-permissions";
import { findActiveCategoryById } from "../infrastructure/category-repository";

export type GetCategoryResult =
  | {
      success: true;
      category: NonNullable<Awaited<ReturnType<typeof findActiveCategoryById>>>;
    }
  | {
      success: false;
      message: string;
    };

export async function getCategory(input: {
  workspaceId: string;
  categoryId: string;
}): Promise<GetCategoryResult> {
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

  if (!canReadCategories(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para visualizar categorias.",
    };
  }

  try {
    const category = await findActiveCategoryById(input.categoryId, input.workspaceId);

    if (!category) {
      return {
        success: false,
        message: "Categoria não encontrada.",
      };
    }

    return {
      success: true,
      category,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar a categoria. Tente novamente.",
    };
  }
}
