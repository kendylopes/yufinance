import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageBudgets } from "../domain/budget-permissions";
import {
  findActiveBudgetByCategoryAndPeriod,
  findArchivedBudgetById,
  restoreArchivedBudgetRecord,
} from "../infrastructure/budget-repository";
import { type RestoreBudgetInput, restoreBudgetSchema } from "./restore-budget.schema";

export type RestoreBudgetResult =
  | {
      success: true;
      budgetId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function restoreBudget(input: RestoreBudgetInput): Promise<RestoreBudgetResult> {
  const parsed = restoreBudgetSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados do orçamento inválidos.",
    };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    };
  }

  const membership = await findWorkspaceMembership(currentUser.id, parsed.data.workspaceId);

  if (!membership) {
    return {
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    };
  }

  if (!canManageBudgets(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para gerenciar orçamentos.",
    };
  }

  try {
    const archivedBudget = await findArchivedBudgetById(
      parsed.data.budgetId,
      parsed.data.workspaceId,
    );

    if (!archivedBudget) {
      return {
        success: false,
        message: "Orçamento arquivado não encontrado.",
      };
    }

    const conflictingBudget = await findActiveBudgetByCategoryAndPeriod({
      workspaceId: archivedBudget.workspaceId,
      categoryId: archivedBudget.categoryId,
      month: archivedBudget.month,
      year: archivedBudget.year,
    });

    if (conflictingBudget) {
      return {
        success: false,
        message: "Já existe um orçamento ativo para esta categoria no período informado.",
      };
    }

    const restoredBudget = await restoreArchivedBudgetRecord({
      budgetId: parsed.data.budgetId,
      workspaceId: parsed.data.workspaceId,
    });

    if (!restoredBudget) {
      return {
        success: false,
        message: "Orçamento arquivado não encontrado.",
      };
    }

    return {
      success: true,
      budgetId: restoredBudget.id,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível restaurar o orçamento. Tente novamente.",
    };
  }
}
