import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageTransactions } from "../domain/transaction-permissions";
import { restoreCanceledTransactionRecord } from "../infrastructure/transaction-repository";

export type RestoreTransactionResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function restoreTransaction(input: {
  workspaceId: string;
  transactionId: string;
}): Promise<RestoreTransactionResult> {
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

  if (!canManageTransactions(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para restaurar transações.",
    };
  }

  try {
    const transaction = await restoreCanceledTransactionRecord({
      workspaceId: input.workspaceId,
      transactionId: input.transactionId,
    });

    if (!transaction) {
      return {
        success: false,
        message: "Transação cancelada não encontrada.",
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível restaurar a transação. Tente novamente.",
    };
  }
}
