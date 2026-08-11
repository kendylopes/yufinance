import "server-only";

import { getDashboardKpisRecord } from "../infrastructure/dashboard-kpis.repository";
import type { DashboardKpisDto } from "./dashboard-kpis.dto";
import type { DashboardPeriod } from "./dashboard-period";
import { getDashboardContext } from "./get-dashboard-context";

export type GetDashboardKpisResult =
  | {
      success: true;
      kpis: DashboardKpisDto;
    }
  | {
      success: false;
      message: string;
    };

export async function getDashboardKpis(input: {
  workspaceId: string;
  period?: DashboardPeriod;
  referenceDate?: Date;
}): Promise<GetDashboardKpisResult> {
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
    const record = await getDashboardKpisRecord({
      workspaceId,
      startDate,
      endDate,
    });

    return {
      success: true,
      kpis: {
        activeAccountsCount: record.activeAccountsCount,
        activeCategoriesCount: record.activeCategoriesCount,
        periodTransactionsCount: record.periodTransactionsCount,
        lastMovementAt: record.lastMovementAt,
      },
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível carregar os indicadores do Dashboard. Tente novamente.",
    };
  }
}
