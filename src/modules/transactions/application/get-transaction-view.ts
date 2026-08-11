import "server-only";

import { listCategories } from "@/modules/categories/application/list-categories";
import { listFinancialAccounts } from "@/modules/financial-accounts/application/list-financial-accounts";
import type { CategoryOption, FinancialAccountOption, TransactionFormDto } from "./dto";
import { getTransaction } from "./get-transaction";

export type GetTransactionViewResult =
  | {
      success: true;
      transaction: TransactionFormDto;
      financialAccounts: FinancialAccountOption[];
      categories: CategoryOption[];
    }
  | {
      success: false;
      message: string;
    };

export async function getTransactionView(input: {
  workspaceId: string;
  transactionId: string;
}): Promise<GetTransactionViewResult> {
  const [transactionResult, financialAccountsResult, categoriesResult] = await Promise.all([
    getTransaction(input),
    listFinancialAccounts(input.workspaceId),
    listCategories(input.workspaceId),
  ]);

  if (!transactionResult.success) {
    return transactionResult;
  }

  if (!financialAccountsResult.success) {
    return financialAccountsResult;
  }

  if (!categoriesResult.success) {
    return categoriesResult;
  }

  return {
    success: true,
    transaction: {
      id: transactionResult.transaction.id,
      financialAccountId: transactionResult.transaction.financialAccountId,
      categoryId: transactionResult.transaction.categoryId,
      type: transactionResult.transaction.type,
      description: transactionResult.transaction.description,
      amount: transactionResult.transaction.amount,
      occurredAt: transactionResult.transaction.occurredAt,
      notes: transactionResult.transaction.notes,
    },
    financialAccounts: financialAccountsResult.financialAccounts.map((account) => ({
      id: account.id,
      name: account.name,
    })),
    categories: categoriesResult.categories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type,
    })),
  };
}
