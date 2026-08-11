import "server-only";

import { findActiveCategoryById } from "@/modules/categories/infrastructure/category-repository";
import { findActiveFinancialAccountById } from "@/modules/financial-accounts/infrastructure/financial-account-repository";
import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageTransactions } from "../domain/transaction-permissions";
import { updateActiveTransactionRecord } from "../infrastructure/transaction-repository";
import { type UpdateTransactionInput, updateTransactionSchema } from "./update-transaction.schema";

export type UpdateTransactionResult =
  | {
      success: true;
      transactionId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function updateTransaction(input: {
  workspaceId: string;
  transactionId: string;
  transaction: UpdateTransactionInput;
}): Promise<UpdateTransactionResult> {
  const parsed = updateTransactionSchema.safeParse(input.transaction);

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
      message: "Você não possui permissão para editar transações.",
    };
  }

  try {
    const financialAccount = await findActiveFinancialAccountById(
      parsed.data.financialAccountId,
      input.workspaceId,
    );

    if (!financialAccount) {
      return {
        success: false,
        message: "Conta financeira ativa não encontrada.",
      };
    }

    const category = await findActiveCategoryById(parsed.data.categoryId, input.workspaceId);

    if (!category) {
      return {
        success: false,
        message: "Categoria ativa não encontrada.",
      };
    }

    if (category.type !== parsed.data.type) {
      return {
        success: false,
        message: "O tipo da categoria não corresponde ao tipo da transação.",
      };
    }

    const transaction = await updateActiveTransactionRecord({
      transactionId: input.transactionId,
      workspaceId: input.workspaceId,
      transaction: parsed.data,
    });

    if (!transaction) {
      return {
        success: false,
        message: "Transação não encontrada.",
      };
    }

    return {
      success: true,
      transactionId: transaction.id,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível atualizar a transação. Tente novamente.",
    };
  }
}
