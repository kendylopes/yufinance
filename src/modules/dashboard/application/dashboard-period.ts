export type DashboardPeriod =
  | "TODAY"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "CURRENT_MONTH"
  | "CURRENT_YEAR";

export type DashboardDateRange = {
  startDate: Date;
  endDate: Date;
};

export function resolveDashboardPeriod(
  period: DashboardPeriod,
  referenceDate: Date = new Date(),
): DashboardDateRange {
  const endDate = new Date(referenceDate);

  switch (period) {
    case "TODAY": {
      const startDate = new Date(referenceDate);
      startDate.setHours(0, 0, 0, 0);

      return {
        startDate,
        endDate,
      };
    }

    case "LAST_7_DAYS": {
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);

      return {
        startDate,
        endDate,
      };
    }

    case "LAST_30_DAYS": {
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - 29);
      startDate.setHours(0, 0, 0, 0);

      return {
        startDate,
        endDate,
      };
    }

    case "CURRENT_YEAR": {
      return {
        startDate: new Date(referenceDate.getFullYear(), 0, 1),
        endDate,
      };
    }

    case "CURRENT_MONTH": {
      return {
        startDate: new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1),
        endDate,
      };
    }

    default: {
      return {
        startDate: new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1),
        endDate,
      };
    }
  }
}
