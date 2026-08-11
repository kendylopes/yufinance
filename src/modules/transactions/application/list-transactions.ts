import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadTransactions } from "../domain/transaction-permissions";
import { listActiveTransactionsByWorkspace } from "../infrastructure/transaction-repository";

export type ListTransactionsResult =
  | {
      success: true;
      transactions: Awaited<ReturnType<typeof listActiveTransactionsByWorkspace>>;
    }
  | {
      success: false;
      message: string;
    };

export async function listTransactions(workspaceId: string): Promise<ListTransactionsResult> {
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

  if (!canReadTransactions(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para visualizar transações.",
    };
  }

  try {
    const transactions = await listActiveTransactionsByWorkspace(workspaceId);

    return {
      success: true,
      transactions,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar as transações. Tente novamente.",
    };
  }
}
