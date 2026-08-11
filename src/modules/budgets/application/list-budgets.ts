import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadBudgets } from "../domain/budget-permissions";
import { calculateBudgetProgress } from "../domain/calculate-budget-progress";
import { listActiveBudgetProgressRecords } from "../infrastructure/budget-repository";
import type { BudgetDto } from "./budget.dto";
import { type ListBudgetsInput, listBudgetsSchema } from "./list-budgets.schema";

export type ListBudgetsResult =
  | {
      success: true;
      budgets: BudgetDto[];
    }
  | {
      success: false;
      message: string;
    };

export async function listBudgets(input: ListBudgetsInput): Promise<ListBudgetsResult> {
  const parsed = listBudgetsSchema.safeParse(input);

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

  const { startDate, endDate } = resolveBudgetPeriod(parsed.data.year, parsed.data.month);

  try {
    const records = await listActiveBudgetProgressRecords({
      workspaceId: parsed.data.workspaceId,
      month: parsed.data.month,
      year: parsed.data.year,
      startDate,
      endDate,
    });

    return {
      success: true,
      budgets: records.map((record) => mapBudget(record)),
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar os orçamentos. Tente novamente.",
    };
  }
}

function resolveBudgetPeriod(year: number, month: number) {
  const startDate = new Date(Date.UTC(year, month - 1, 1));

  const endDate = new Date(Date.UTC(year, month, 1));

  return {
    startDate,
    endDate,
  };
}

function mapBudget(
  record: Awaited<ReturnType<typeof listActiveBudgetProgressRecords>>[number],
): BudgetDto {
  const progress = calculateBudgetProgress({
    plannedAmount: record.plannedAmount,
    spentAmount: record.spentAmount,
  });

  return {
    id: record.id,
    workspaceId: record.workspaceId,
    categoryId: record.categoryId,
    categoryName: record.categoryName,
    month: record.month,
    year: record.year,
    ...progress,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}
