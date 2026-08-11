import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageBudgets } from "../domain/budget-permissions";
import {
  archiveActiveBudgetRecord,
  findActiveBudgetById,
} from "../infrastructure/budget-repository";
import { type ArchiveBudgetInput, archiveBudgetSchema } from "./archive-budget.schema";

export type ArchiveBudgetResult =
  | {
      success: true;
      budgetId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function archiveBudget(input: ArchiveBudgetInput): Promise<ArchiveBudgetResult> {
  const parsed = archiveBudgetSchema.safeParse(input);

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
    const budget = await findActiveBudgetById(parsed.data.budgetId, parsed.data.workspaceId);

    if (!budget) {
      return {
        success: false,
        message: "Orçamento não encontrado.",
      };
    }

    const archivedBudget = await archiveActiveBudgetRecord({
      budgetId: parsed.data.budgetId,
      workspaceId: parsed.data.workspaceId,
    });

    if (!archivedBudget) {
      return {
        success: false,
        message: "Orçamento não encontrado.",
      };
    }

    return {
      success: true,
      budgetId: archivedBudget.id,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível arquivar o orçamento. Tente novamente.",
    };
  }
}
