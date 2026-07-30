import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageFinancialAccounts } from "../domain/financial-account-permissions";
import { restoreArchivedFinancialAccountRecord } from "../infrastructure/financial-account-repository";

export type RestoreFinancialAccountResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function restoreFinancialAccount(input: {
  workspaceId: string;
  financialAccountId: string;
}): Promise<RestoreFinancialAccountResult> {
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

  if (!canManageFinancialAccounts(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para restaurar contas financeiras.",
    };
  }

  try {
    const financialAccount = await restoreArchivedFinancialAccountRecord({
      workspaceId: input.workspaceId,
      financialAccountId: input.financialAccountId,
    });

    if (!financialAccount) {
      return {
        success: false,
        message: "Conta financeira arquivada não encontrada.",
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível restaurar a conta financeira. Tente novamente.",
    };
  }
}
