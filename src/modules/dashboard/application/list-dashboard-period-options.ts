import {
  type DashboardPeriodOptionDto,
  dashboardPeriodOptions,
} from "./dashboard-period-option.dto";

export function listDashboardPeriodOptions(): readonly DashboardPeriodOptionDto[] {
  return dashboardPeriodOptions;
}
