import "server-only";

import { getCategoryExpensesRecord } from "../infrastructure/dashboard-category-expenses.repository";
import type { CategoryExpensesChartDto } from "./category-expenses-chart.dto";
import type { DashboardPeriod } from "./dashboard-period";
import { getDashboardContext } from "./get-dashboard-context";

export type GetCategoryExpensesChartResult =
  | {
      success: true;
      chart: CategoryExpensesChartDto;
    }
  | {
      success: false;
      message: string;
    };

export async function getCategoryExpensesChart(input: {
  workspaceId: string;
  period?: DashboardPeriod;
  referenceDate?: Date;
}): Promise<GetCategoryExpensesChartResult> {
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
    const records = await getCategoryExpensesRecord({
      workspaceId,
      startDate,
      endDate,
    });

    const totalExpense = records.reduce((total, record) => total + Number(record.amount), 0);

    return {
      success: true,
      chart: {
        totalExpense: totalExpense.toFixed(4),
        categories: records.map((record) => {
          const amount = Number(record.amount);

          return {
            categoryId: record.categoryId,
            categoryName: record.categoryName,
            amount: amount.toFixed(4),
            percentage: totalExpense > 0 ? Number(((amount / totalExpense) * 100).toFixed(2)) : 0,
          };
        }),
      },
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar as despesas por categoria. Tente novamente.",
    };
  }
}
