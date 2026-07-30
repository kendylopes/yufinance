import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageFinancialAccounts } from "../domain/financial-account-permissions";
import { archiveActiveFinancialAccountRecord } from "../infrastructure/financial-account-repository";

export type ArchiveFinancialAccountResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function archiveFinancialAccount(input: {
  workspaceId: string;
  financialAccountId: string;
}): Promise<ArchiveFinancialAccountResult> {
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
      message: "Você não possui permissão para arquivar contas financeiras.",
    };
  }

  try {
    const financialAccount = await archiveActiveFinancialAccountRecord({
      workspaceId: input.workspaceId,
      financialAccountId: input.financialAccountId,
    });

    if (!financialAccount) {
      return {
        success: false,
        message: "Conta financeira não encontrada.",
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível arquivar a conta financeira. Tente novamente.",
    };
  }
}
