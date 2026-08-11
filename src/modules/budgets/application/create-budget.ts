import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageBudgets } from "../domain/budget-permissions";
import {
  createBudgetRecord,
  findActiveBudgetByCategoryAndPeriod,
  findActiveExpenseCategoryById,
} from "../infrastructure/budget-repository";
import { type CreateBudgetInput, createBudgetSchema } from "./create-budget.schema";

export type CreateBudgetResult =
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

export async function createBudget(input: CreateBudgetInput): Promise<CreateBudgetResult> {
  const parsed = createBudgetSchema.safeParse(input);

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
    const category = await findActiveExpenseCategoryById(
      parsed.data.categoryId,
      parsed.data.workspaceId,
    );

    if (!category) {
      return {
        success: false,
        message:
          "A categoria informada não existe, está arquivada ou não é uma categoria de despesa.",
      };
    }

    const existingBudget = await findActiveBudgetByCategoryAndPeriod({
      workspaceId: parsed.data.workspaceId,
      categoryId: parsed.data.categoryId,
      month: parsed.data.month,
      year: parsed.data.year,
    });

    if (existingBudget) {
      return {
        success: false,
        message: "Já existe um orçamento ativo para esta categoria no período informado.",
      };
    }

    const budget = await createBudgetRecord({
      workspaceId: parsed.data.workspaceId,
      categoryId: parsed.data.categoryId,
      month: parsed.data.month,
      year: parsed.data.year,
      plannedAmount: parsed.data.plannedAmount.toFixed(4),
    });

    return {
      success: true,
      budget,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível criar o orçamento. Tente novamente.",
    };
  }
}
