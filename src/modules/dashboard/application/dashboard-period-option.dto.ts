import type { DashboardPeriod } from "./dashboard-period";

export type DashboardPeriodOptionDto = {
  value: DashboardPeriod;
  label: string;
};

export const dashboardPeriodOptions: readonly DashboardPeriodOptionDto[] = [
  {
    value: "TODAY",
    label: "Hoje",
  },
  {
    value: "LAST_7_DAYS",
    label: "Últimos 7 dias",
  },
  {
    value: "LAST_30_DAYS",
    label: "Últimos 30 dias",
  },
  {
    value: "CURRENT_MONTH",
    label: "Mês atual",
  },
  {
    value: "CURRENT_YEAR",
    label: "Ano atual",
  },
] as const;
