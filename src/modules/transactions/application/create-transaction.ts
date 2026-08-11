import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageTransactions } from "../domain/transaction-permissions";
import { createTransactionRecord } from "../infrastructure/transaction-repository";
import { type CreateTransactionInput, createTransactionSchema } from "./create-transaction.schema";

export type CreateTransactionResult =
  | {
      success: true;
      transactionId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createTransaction(input: {
  workspaceId: string;
  transaction: CreateTransactionInput;
}): Promise<CreateTransactionResult> {
  const parsed = createTransactionSchema.safeParse(input.transaction);

  if (!parsed.success) {
    return {
      success: false,
      message: "Os dados informados não são válidos.",
    };
  }

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
      message: "Você não possui permissão para criar transações.",
    };
  }

  try {
    const transaction = await createTransactionRecord({
      workspaceId: input.workspaceId,
      transaction: parsed.data,
    });

    return {
      success: true,
      transactionId: transaction.id,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível criar a transação. Tente novamente.",
    };
  }
}
