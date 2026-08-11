import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadTransactions } from "../domain/transaction-permissions";
import { findActiveTransactionById } from "../infrastructure/transaction-repository";

export type GetTransactionResult =
  | {
      success: true;
      transaction: NonNullable<Awaited<ReturnType<typeof findActiveTransactionById>>>;
    }
  | {
      success: false;
      message: string;
    };

export async function getTransaction(input: {
  workspaceId: string;
  transactionId: string;
}): Promise<GetTransactionResult> {
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

  if (!canReadTransactions(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para visualizar transações.",
    };
  }

  try {
    const transaction = await findActiveTransactionById(input.transactionId, input.workspaceId);

    if (!transaction) {
      return {
        success: false,
        message: "Transação não encontrada.",
      };
    }

    return {
      success: true,
      transaction,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar a transação. Tente novamente.",
    };
  }
}
