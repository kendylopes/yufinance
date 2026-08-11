import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("./get-dashboard-context", () => ({
  getDashboardContext: vi.fn(),
}));

vi.mock("../infrastructure/dashboard-monthly-evolution.repository", () => ({
  getMonthlyEvolutionRecord: vi.fn(),
}));

import { getMonthlyEvolutionRecord } from "../infrastructure/dashboard-monthly-evolution.repository";
import { getDashboardContext } from "./get-dashboard-context";
import { getMonthlyEvolutionChart } from "./get-monthly-evolution-chart";

const getDashboardContextMock = vi.mocked(getDashboardContext);

const getMonthlyEvolutionRecordMock = vi.mocked(getMonthlyEvolutionRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const referenceDate = new Date("2026-08-15T12:00:00.000Z");

const startDate = new Date(2026, 0, 1, 0, 0, 0, 0);

describe("getMonthlyEvolutionChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propaga erro retornado pelo contexto", async () => {
    getDashboardContextMock.mockResolvedValue({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    const result = await getMonthlyEvolutionChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(getMonthlyEvolutionRecordMock).not.toHaveBeenCalled();
  });

  it("usa CURRENT_YEAR como período padrão", async () => {
    mockContext();

    getMonthlyEvolutionRecordMock.mockResolvedValue([]);

    await getMonthlyEvolutionChart({
      workspaceId,
      referenceDate,
    });

    expect(getDashboardContextMock).toHaveBeenCalledWith({
      workspaceId,
      period: undefined,
      defaultPeriod: "CURRENT_YEAR",
      referenceDate,
    });
  });

  it("prioriza o período explicitamente informado", async () => {
    mockContext();

    getMonthlyEvolutionRecordMock.mockResolvedValue([]);

    await getMonthlyEvolutionChart({
      workspaceId,
      period: "LAST_30_DAYS",
      referenceDate,
    });

    expect(getDashboardContextMock).toHaveBeenCalledWith({
      workspaceId,
      period: "LAST_30_DAYS",
      defaultPeriod: "CURRENT_YEAR",
      referenceDate,
    });
  });

  it("retorna uma lista vazia", async () => {
    mockContext();

    getMonthlyEvolutionRecordMock.mockResolvedValue([]);

    const result = await getMonthlyEvolutionChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      chart: [],
    });
  });

  it("retorna os dados da evolução mensal", async () => {
    mockContext();

    getMonthlyEvolutionRecordMock.mockResolvedValue([
      {
        month: "Jan",
        income: "1200.0000",
        expense: "800.0000",
      },
      {
        month: "Fev",
        income: "1500.0000",
        expense: "950.0000",
      },
    ]);

    const result = await getMonthlyEvolutionChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      chart: [
        {
          month: "Jan",
          income: "1200.0000",
          expense: "800.0000",
        },
        {
          month: "Fev",
          income: "1500.0000",
          expense: "950.0000",
        },
      ],
    });

    expect(getMonthlyEvolutionRecordMock).toHaveBeenCalledWith({
      workspaceId,
      startDate,
      endDate: referenceDate,
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockContext();

    getMonthlyEvolutionRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await getMonthlyEvolutionChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar a evolução mensal. Tente novamente.",
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
