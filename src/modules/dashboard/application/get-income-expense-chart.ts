import "server-only";

import { getIncomeExpenseChartRecord } from "../infrastructure/dashboard-charts.repository";
import type { DashboardPeriod } from "./dashboard-period";
import { getDashboardContext } from "./get-dashboard-context";
import type { IncomeExpenseChartDto } from "./income-expense-chart.dto";

export type GetIncomeExpenseChartResult =
  | {
      success: true;
      chart: IncomeExpenseChartDto;
    }
  | {
      success: false;
      message: string;
    };

export async function getIncomeExpenseChart(input: {
  workspaceId: string;
  period?: DashboardPeriod;
  referenceDate?: Date;
}): Promise<GetIncomeExpenseChartResult> {
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
    const record = await getIncomeExpenseChartRecord({
      workspaceId,
      startDate,
      endDate,
    });

    return {
      success: true,
      chart: {
        income: record.income,
        expense: record.expense,
      },
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar os dados do gráfico. Tente novamente.",
    };
  }
}
