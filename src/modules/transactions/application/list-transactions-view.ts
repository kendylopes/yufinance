import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadTransactions } from "../domain/transaction-permissions";
import { listTransactionViewsByWorkspace } from "../infrastructure/transaction-repository";
import type { TransactionViewDto } from "./dto";

export type ListTransactionsViewResult =
  | {
      success: true;
      transactions: TransactionViewDto[];
    }
  | {
      success: false;
      message: string;
    };

export async function listTransactionsView(
  workspaceId: string,
): Promise<ListTransactionsViewResult> {
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
    const transactions = await listTransactionViewsByWorkspace(workspaceId);

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
