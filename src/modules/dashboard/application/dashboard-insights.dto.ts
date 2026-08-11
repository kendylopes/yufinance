export type DashboardInsightSeverity = "info" | "success" | "warning";

export type DashboardInsightDto = {
  id: string;
  title: string;
  description: string;
  severity: DashboardInsightSeverity;
};

export type DashboardInsightsDto = DashboardInsightDto[];
