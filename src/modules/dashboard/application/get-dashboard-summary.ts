import "server-only";

import { getDashboardSummaryRecord } from "../infrastructure/dashboard-repository";
import type { DashboardPeriod } from "./dashboard-period";
import type { DashboardSummaryDto } from "./dashboard-summary.dto";
import { getDashboardContext } from "./get-dashboard-context";

export type GetDashboardSummaryResult =
  | {
      success: true;
      summary: DashboardSummaryDto;
    }
  | {
      success: false;
      message: string;
    };

export async function getDashboardSummary(input: {
  workspaceId: string;
  period?: DashboardPeriod;
  referenceDate?: Date;
}): Promise<GetDashboardSummaryResult> {
  const contextResult = await getDashboardContext({
    workspaceId: input.workspaceId,
    period: input.period,
    referenceDate: input.referenceDate,
  });

  if (!contextResult.success) {
    return contextResult;
  }

  const { workspaceId, startDate, endDate } = contextResult.context;

  try {
    const record = await getDashboardSummaryRecord({
      workspaceId,
      startDate,
      endDate,
    });

    if (!record) {
      return {
        success: false,
        message: "Workspace não encontrado.",
      };
    }

    const currentBalance =
      Number(record.initialBalance) + Number(record.totalIncome) - Number(record.totalExpense);

    const monthlyResult = Number(record.monthlyIncome) - Number(record.monthlyExpense);

    return {
      success: true,
      summary: {
        currency: record.currency,
        currentBalance: currentBalance.toFixed(4),
        monthlyIncome: Number(record.monthlyIncome).toFixed(4),
        monthlyExpense: Number(record.monthlyExpense).toFixed(4),
        monthlyResult: monthlyResult.toFixed(4),
        activeAccountsCount: record.activeAccountsCount,
        monthlyTransactionsCount: record.monthlyTransactionsCount,
      },
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar o resumo financeiro. Tente novamente.",
    };
  }
}
