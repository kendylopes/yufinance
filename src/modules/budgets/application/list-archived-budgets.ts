import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadBudgets } from "../domain/budget-permissions";
import { listArchivedBudgetsByWorkspace } from "../infrastructure/budget-repository";

export type ListArchivedBudgetsResult =
  | {
      success: true;
      budgets: Awaited<ReturnType<typeof listArchivedBudgetsByWorkspace>>;
    }
  | {
      success: false;
      message: string;
    };

export async function listArchivedBudgets(workspaceId: string): Promise<ListArchivedBudgetsResult> {
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

  if (!canReadBudgets(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para visualizar orçamentos.",
    };
  }

  try {
    const budgets = await listArchivedBudgetsByWorkspace(workspaceId);

    return {
      success: true,
      budgets,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar os orçamentos arquivados. Tente novamente.",
    };
  }
}
