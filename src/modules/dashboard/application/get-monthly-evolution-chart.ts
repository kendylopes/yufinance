import "server-only";

import { getMonthlyEvolutionRecord } from "../infrastructure/dashboard-monthly-evolution.repository";
import type { DashboardPeriod } from "./dashboard-period";
import { getDashboardContext } from "./get-dashboard-context";
import type { MonthlyEvolutionChartDto } from "./monthly-evolution-chart.dto";

export type GetMonthlyEvolutionChartResult =
  | {
      success: true;
      chart: MonthlyEvolutionChartDto;
    }
  | {
      success: false;
      message: string;
    };

export async function getMonthlyEvolutionChart(input: {
  workspaceId: string;
  period?: DashboardPeriod;
  referenceDate?: Date;
}): Promise<GetMonthlyEvolutionChartResult> {
  const contextResult = await getDashboardContext({
    workspaceId: input.workspaceId,
    period: input.period,
    defaultPeriod: "CURRENT_YEAR",
    referenceDate: input.referenceDate,
  });

  if (!contextResult.success) {
    return contextResult;
  }

  const { workspaceId, startDate, endDate } = contextResult.context;

  try {
    const chart = await getMonthlyEvolutionRecord({
      workspaceId,
      startDate,
      endDate,
    });

    return {
      success: true,
      chart,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar a evolução mensal. Tente novamente.",
    };
  }
}
