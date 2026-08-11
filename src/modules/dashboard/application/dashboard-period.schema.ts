import { z } from "zod";

export const dashboardPeriodSchema = z.object({
  period: z
    .enum(["TODAY", "LAST_7_DAYS", "LAST_30_DAYS", "CURRENT_MONTH", "CURRENT_YEAR"])
    .default("CURRENT_MONTH"),

  referenceDate: z.coerce.date().optional(),
});

export type DashboardPeriodInput = z.input<typeof dashboardPeriodSchema>;

export type DashboardPeriodData = z.output<typeof dashboardPeriodSchema>;
