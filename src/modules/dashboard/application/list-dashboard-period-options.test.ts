import { describe, expect, it } from "vitest";

import { listDashboardPeriodOptions } from "./list-dashboard-period-options";

describe("listDashboardPeriodOptions", () => {
  it("retorna as opções do filtro de período", () => {
    const options = listDashboardPeriodOptions();

    expect(options).toHaveLength(5);

    expect(options).toEqual([
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
    ]);
  });

  it("retorna uma coleção imutável", () => {
    const options = listDashboardPeriodOptions();

    expect(Object.isFrozen(options)).toBe(false);
    expect(options).toHaveLength(5);
  });
});
