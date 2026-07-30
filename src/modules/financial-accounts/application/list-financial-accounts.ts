import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadFinancialAccounts } from "../domain/financial-account-permissions";
import { listActiveFinancialAccountsByWorkspace } from "../infrastructure/financial-account-repository";

export type ListFinancialAccountsResult =
  | {
      success: true;
      financialAccounts: Awaited<ReturnType<typeof listActiveFinancialAccountsByWorkspace>>;
    }
  | {
      success: false;
      message: string;
    };

export async function listFinancialAccounts(
  workspaceId: string,
): Promise<ListFinancialAccountsResult> {
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

  if (!canReadFinancialAccounts(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para visualizar contas financeiras.",
    };
  }

  try {
    const financialAccounts = await listActiveFinancialAccountsByWorkspace(workspaceId);

    return {
      success: true,
      financialAccounts,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar as contas financeiras. Tente novamente.",
    };
  }
}
