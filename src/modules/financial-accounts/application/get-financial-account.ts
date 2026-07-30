import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadFinancialAccounts } from "../domain/financial-account-permissions";
import { findActiveFinancialAccountById } from "../infrastructure/financial-account-repository";

export type GetFinancialAccountResult =
  | {
      success: true;
      financialAccount: NonNullable<Awaited<ReturnType<typeof findActiveFinancialAccountById>>>;
    }
  | {
      success: false;
      message: string;
    };

export async function getFinancialAccount(input: {
  workspaceId: string;
  financialAccountId: string;
}): Promise<GetFinancialAccountResult> {
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

  if (!canReadFinancialAccounts(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para visualizar contas financeiras.",
    };
  }

  try {
    const financialAccount = await findActiveFinancialAccountById(
      input.financialAccountId,
      input.workspaceId,
    );

    if (!financialAccount) {
      return {
        success: false,
        message: "Conta financeira não encontrada.",
      };
    }

    return {
      success: true,
      financialAccount,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar a conta financeira. Tente novamente.",
    };
  }
}
