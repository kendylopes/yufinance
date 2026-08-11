import { describe, expect, it } from "vitest";

import { resolveDashboardPeriod } from "./dashboard-period";

const referenceDate = new Date("2026-08-15T18:30:00.000Z");

describe("resolveDashboardPeriod", () => {
  it("resolve TODAY", () => {
    const result = resolveDashboardPeriod("TODAY", referenceDate);

    expect(result.startDate).toEqual(new Date(2026, 7, 15, 0, 0, 0, 0));

    expect(result.endDate).toEqual(referenceDate);
  });

  it("resolve LAST_7_DAYS", () => {
    const result = resolveDashboardPeriod("LAST_7_DAYS", referenceDate);

    expect(result.startDate).toEqual(new Date(2026, 7, 9, 0, 0, 0, 0));

    expect(result.endDate).toEqual(referenceDate);
  });

  it("resolve LAST_30_DAYS", () => {
    const result = resolveDashboardPeriod("LAST_30_DAYS", referenceDate);

    expect(result.startDate).toEqual(new Date(2026, 6, 17, 0, 0, 0, 0));

    expect(result.endDate).toEqual(referenceDate);
  });

  it("resolve CURRENT_MONTH", () => {
    const result = resolveDashboardPeriod("CURRENT_MONTH", referenceDate);

    expect(result.startDate).toEqual(new Date(2026, 7, 1));

    expect(result.endDate).toEqual(referenceDate);
  });

  it("resolve CURRENT_YEAR", () => {
    const result = resolveDashboardPeriod("CURRENT_YEAR", referenceDate);

    expect(result.startDate).toEqual(new Date(2026, 0, 1));

    expect(result.endDate).toEqual(referenceDate);
  });

  it("não altera a data de referência recebida", () => {
    const originalTimestamp = referenceDate.getTime();

    resolveDashboardPeriod("LAST_7_DAYS", referenceDate);

    expect(referenceDate.getTime()).toBe(originalTimestamp);
  });
});
