import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadCategories } from "../domain/category-permissions";
import { findArchivedCategoriesByWorkspaceId } from "../infrastructure/category-repository";

export type ListArchivedCategoriesResult =
  | {
      success: true;
      categories: Awaited<ReturnType<typeof findArchivedCategoriesByWorkspaceId>>;
    }
  | {
      success: false;
      message: string;
    };

export async function listArchivedCategories(
  workspaceId: string,
): Promise<ListArchivedCategoriesResult> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    };
  }

  const membership = await findWorkspaceMembership(currentUser.id, workspaceId);

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
    const categories = await findArchivedCategoriesByWorkspaceId(workspaceId);

    return {
      success: true,
      categories,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar as categorias arquivadas. Tente novamente.",
    };
  }
}
