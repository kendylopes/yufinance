import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageBudgets } from "../domain/budget-permissions";
import {
  findActiveBudgetByCategoryAndPeriod,
  findActiveBudgetById,
  updateActiveBudgetRecord,
} from "../infrastructure/budget-repository";
import { type UpdateBudgetInput, updateBudgetSchema } from "./update-budget.schema";

export type UpdateBudgetResult =
  | {
      success: true;
      budget: {
        id: string;
        workspaceId: string;
        categoryId: string;
        month: number;
        year: number;
        plannedAmount: string;
        archivedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  | {
      success: false;
      message: string;
    };

export async function updateBudget(input: UpdateBudgetInput): Promise<UpdateBudgetResult> {
  const parsed = updateBudgetSchema.safeParse(input);

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
    const currentBudget = await findActiveBudgetById(parsed.data.budgetId, parsed.data.workspaceId);

    if (!currentBudget) {
      return {
        success: false,
        message: "Orçamento não encontrado.",
      };
    }

    const periodChanged =
      currentBudget.month !== parsed.data.month || currentBudget.year !== parsed.data.year;

    if (periodChanged) {
      const conflictingBudget = await findActiveBudgetByCategoryAndPeriod({
        workspaceId: parsed.data.workspaceId,
        categoryId: currentBudget.categoryId,
        month: parsed.data.month,
        year: parsed.data.year,
      });

      if (conflictingBudget && conflictingBudget.id !== currentBudget.id) {
        return {
          success: false,
          message: "Já existe um orçamento ativo para esta categoria no período informado.",
        };
      }
    }

    const updatedBudget = await updateActiveBudgetRecord({
      budgetId: parsed.data.budgetId,
      workspaceId: parsed.data.workspaceId,
      month: parsed.data.month,
      year: parsed.data.year,
      plannedAmount: parsed.data.plannedAmount.toFixed(4),
    });

    if (!updatedBudget) {
      return {
        success: false,
        message: "Orçamento não encontrado.",
      };
    }

    return {
      success: true,
      budget: updatedBudget,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível atualizar o orçamento. Tente novamente.",
    };
  }
}
