import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";
import { canReadBudgets } from "../domain/budget-permissions";
import { calculateBudgetProgress } from "../domain/calculate-budget-progress";
import {
  findActiveBudgetById,
  getBudgetProgressRecordById,
} from "../infrastructure/budget-repository";
import type { BudgetDto } from "./budget.dto";
import { type GetBudgetInput, getBudgetSchema } from "./get-budget.schema";

export type GetBudgetResult =
  | {
      success: true;
      budget: BudgetDto;
    }
  | {
      success: false;
      message: string;
    };

export async function getBudget(input: GetBudgetInput): Promise<GetBudgetResult> {
  const parsed = getBudgetSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados para consulta inválidos.",
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

  if (!canReadBudgets(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para consultar orçamentos.",
    };
  }

  try {
    const budget = await findActiveBudgetById(parsed.data.budgetId, parsed.data.workspaceId);

    if (!budget) {
      return {
        success: false,
        message: "Orçamento não encontrado.",
      };
    }

    const { startDate, endDate } = resolveBudgetPeriod(budget.year, budget.month);

    const budgetRecord = await getBudgetProgressRecordById({
      workspaceId: parsed.data.workspaceId,
      budgetId: parsed.data.budgetId,
      startDate,
      endDate,
    });

    if (!budgetRecord) {
      return {
        success: false,
        message: "Orçamento não encontrado.",
      };
    }

    const progress = calculateBudgetProgress({
      plannedAmount: budgetRecord.plannedAmount,
      spentAmount: budgetRecord.spentAmount,
    });

    return {
      success: true,
      budget: {
        id: budgetRecord.id,
        workspaceId: budgetRecord.workspaceId,
        categoryId: budgetRecord.categoryId,
        categoryName: budgetRecord.categoryName,
        month: budgetRecord.month,
        year: budgetRecord.year,
        ...progress,
        createdAt: budgetRecord.createdAt,
        updatedAt: budgetRecord.updatedAt,
      },
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar o orçamento. Tente novamente.",
    };
  }
}

function resolveBudgetPeriod(year: number, month: number) {
  return {
    startDate: new Date(Date.UTC(year, month - 1, 1)),
    endDate: new Date(Date.UTC(year, month, 1)),
  };
}
