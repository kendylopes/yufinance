import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("./get-dashboard-context", () => ({
  getDashboardContext: vi.fn(),
}));

vi.mock("../infrastructure/dashboard-charts.repository", () => ({
  getIncomeExpenseChartRecord: vi.fn(),
}));

import { getIncomeExpenseChartRecord } from "../infrastructure/dashboard-charts.repository";
import { getDashboardContext } from "./get-dashboard-context";
import { getIncomeExpenseChart } from "./get-income-expense-chart";

const getDashboardContextMock = vi.mocked(getDashboardContext);

const getIncomeExpenseChartRecordMock = vi.mocked(getIncomeExpenseChartRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const referenceDate = new Date("2026-08-15T12:00:00.000Z");

const startDate = new Date(2026, 7, 1, 0, 0, 0, 0);

describe("getIncomeExpenseChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propaga erro retornado pelo contexto", async () => {
    getDashboardContextMock.mockResolvedValue({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    const result = await getIncomeExpenseChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(getIncomeExpenseChartRecordMock).not.toHaveBeenCalled();
  });

  it("envia período e data de referência para o contexto", async () => {
    mockContext();

    getIncomeExpenseChartRecordMock.mockResolvedValue({
      income: "0",
      expense: "0",
    });

    await getIncomeExpenseChart({
      workspaceId,
      period: "LAST_7_DAYS",
      referenceDate,
    });

    expect(getDashboardContextMock).toHaveBeenCalledWith({
      workspaceId,
      period: "LAST_7_DAYS",
      referenceDate,
    });
  });

  it("retorna os dados do gráfico", async () => {
    mockContext();

    getIncomeExpenseChartRecordMock.mockResolvedValue({
      income: "1500.0000",
      expense: "725.5000",
    });

    const result = await getIncomeExpenseChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      chart: {
        income: "1500.0000",
        expense: "725.5000",
      },
    });

    expect(getIncomeExpenseChartRecordMock).toHaveBeenCalledWith({
      workspaceId,
      startDate,
      endDate: referenceDate,
    });
  });

  it("retorna valores zerados", async () => {
    mockContext();

    getIncomeExpenseChartRecordMock.mockResolvedValue({
      income: "0",
      expense: "0",
    });

    const result = await getIncomeExpenseChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      chart: {
        income: "0",
        expense: "0",
      },
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockContext();

    getIncomeExpenseChartRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await getIncomeExpenseChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar os dados do gráfico. Tente novamente.",
    });
  });
});

function mockContext() {
  getDashboardContextMock.mockResolvedValue({
    success: true,
    context: {
      workspaceId,
      userId: "user-1",
      startDate,
      endDate: referenceDate,
    },
  });
}
