import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("./get-dashboard-context", () => ({
  getDashboardContext: vi.fn(),
}));

vi.mock("../infrastructure/dashboard-repository", () => ({
  getDashboardSummaryRecord: vi.fn(),
}));

import { getDashboardSummaryRecord } from "../infrastructure/dashboard-repository";
import { getDashboardContext } from "./get-dashboard-context";
import { getDashboardSummary } from "./get-dashboard-summary";

const getDashboardContextMock = vi.mocked(getDashboardContext);

const getDashboardSummaryRecordMock = vi.mocked(getDashboardSummaryRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const referenceDate = new Date("2026-08-15T12:00:00.000Z");
const startDate = new Date(2026, 7, 1);

describe("getDashboardSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propaga erro retornado pelo contexto", async () => {
    getDashboardContextMock.mockResolvedValue({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    const result = await getDashboardSummary({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(getDashboardSummaryRecordMock).not.toHaveBeenCalled();
  });

  it("envia período e data de referência para o contexto", async () => {
    mockContext();

    getDashboardSummaryRecordMock.mockResolvedValue(null);

    await getDashboardSummary({
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

  it("retorna erro quando o Workspace não é encontrado", async () => {
    mockContext();

    getDashboardSummaryRecordMock.mockResolvedValue(null);

    const result = await getDashboardSummary({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Workspace não encontrado.",
    });
  });

  it("retorna o resumo financeiro calculado", async () => {
    mockContext();

    getDashboardSummaryRecordMock.mockResolvedValue({
      currency: "BRL",
      initialBalance: "1000.0000",
      totalIncome: "500.0000",
      totalExpense: "200.0000",
      monthlyIncome: "300.0000",
      monthlyExpense: "100.0000",
      activeAccountsCount: 2,
      monthlyTransactionsCount: 5,
    });

    const result = await getDashboardSummary({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      summary: {
        currency: "BRL",
        currentBalance: "1300.0000",
        monthlyIncome: "300.0000",
        monthlyExpense: "100.0000",
        monthlyResult: "200.0000",
        activeAccountsCount: 2,
        monthlyTransactionsCount: 5,
      },
    });

    expect(getDashboardSummaryRecordMock).toHaveBeenCalledWith({
      workspaceId,
      startDate,
      endDate: referenceDate,
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockContext();

    getDashboardSummaryRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await getDashboardSummary({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar o resumo financeiro. Tente novamente.",
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
