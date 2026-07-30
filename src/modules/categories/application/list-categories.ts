import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadCategories } from "../domain/category-permissions";
import { findActiveCategoriesByWorkspaceId } from "../infrastructure/category-repository";

export type ListCategoriesResult =
  | {
      success: true;
      categories: Awaited<ReturnType<typeof findActiveCategoriesByWorkspaceId>>;
    }
  | {
      success: false;
      message: string;
    };

export async function listCategories(workspaceId: string): Promise<ListCategoriesResult> {
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
    const categories = await findActiveCategoriesByWorkspaceId(workspaceId);

    return {
      success: true,
      categories,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar as categorias. Tente novamente.",
    };
  }
}
