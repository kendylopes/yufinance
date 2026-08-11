import "server-only";

import { listRecentTransactionsRecord } from "../infrastructure/dashboard-repository";
import type { DashboardPeriod } from "./dashboard-period";
import { getDashboardContext } from "./get-dashboard-context";
import type { ListRecentTransactionsResult } from "./list-recent-transactions-result";

export async function listRecentTransactions(input: {
  workspaceId: string;
  period?: DashboardPeriod;
  referenceDate?: Date;
  limit?: number;
}): Promise<ListRecentTransactionsResult> {
  const contextResult = await getDashboardContext({
    workspaceId: input.workspaceId,
    period: input.period,
    referenceDate: input.referenceDate,
  });

  if (!contextResult.success) {
    return contextResult;
  }

  const { workspaceId } = contextResult.context;

  try {
    const records = await listRecentTransactionsRecord({
      workspaceId,
      limit: input.limit,
    });

    return {
      success: true,
      transactions: records.map((record) => ({
        id: record.id,
        description: record.description,
        category: record.category,
        financialAccount: record.financialAccount,
        type: record.type,
        amount: record.amount,
        occurredAt: record.occurredAt,
        canceled: record.canceledAt !== null,
      })),
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar as transações recentes. Tente novamente.",
    };
  }
}
