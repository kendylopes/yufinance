import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("./get-dashboard-context", () => ({
  getDashboardContext: vi.fn(),
}));

vi.mock("../infrastructure/dashboard-category-expenses.repository", () => ({
  getCategoryExpensesRecord: vi.fn(),
}));

import { getCategoryExpensesRecord } from "../infrastructure/dashboard-category-expenses.repository";
import { getCategoryExpensesChart } from "./get-category-expenses-chart";
import { getDashboardContext } from "./get-dashboard-context";

const getDashboardContextMock = vi.mocked(getDashboardContext);

const getCategoryExpensesRecordMock = vi.mocked(getCategoryExpensesRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const referenceDate = new Date("2026-08-15T12:00:00.000Z");

const startDate = new Date(2026, 7, 1, 0, 0, 0, 0);

describe("getCategoryExpensesChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propaga erro retornado pelo contexto", async () => {
    getDashboardContextMock.mockResolvedValue({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    const result = await getCategoryExpensesChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(getCategoryExpensesRecordMock).not.toHaveBeenCalled();
  });

  it("envia período e data de referência para o contexto", async () => {
    mockContext();

    getCategoryExpensesRecordMock.mockResolvedValue([]);

    await getCategoryExpensesChart({
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

  it("retorna lista vazia", async () => {
    mockContext();

    getCategoryExpensesRecordMock.mockResolvedValue([]);

    const result = await getCategoryExpensesChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      chart: {
        totalExpense: "0.0000",
        categories: [],
      },
    });

    expect(getCategoryExpensesRecordMock).toHaveBeenCalledWith({
      workspaceId,
      startDate,
      endDate: referenceDate,
    });
  });

  it("calcula corretamente os percentuais", async () => {
    mockContext();

    getCategoryExpensesRecordMock.mockResolvedValue([
      {
        categoryId: "1",
        categoryName: "Alimentação",
        amount: "400.0000",
      },
      {
        categoryId: "2",
        categoryName: "Transporte",
        amount: "300.0000",
      },
      {
        categoryId: "3",
        categoryName: "Lazer",
        amount: "300.0000",
      },
    ]);

    const result = await getCategoryExpensesChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      chart: {
        totalExpense: "1000.0000",
        categories: [
          {
            categoryId: "1",
            categoryName: "Alimentação",
            amount: "400.0000",
            percentage: 40,
          },
          {
            categoryId: "2",
            categoryName: "Transporte",
            amount: "300.0000",
            percentage: 30,
          },
          {
            categoryId: "3",
            categoryName: "Lazer",
            amount: "300.0000",
            percentage: 30,
          },
        ],
      },
    });

    expect(getCategoryExpensesRecordMock).toHaveBeenCalledWith({
      workspaceId,
      startDate,
      endDate: referenceDate,
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockContext();

    getCategoryExpensesRecordMock.mockRejectedValue(new Error("Database"));

    const result = await getCategoryExpensesChart({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar as despesas por categoria. Tente novamente.",
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
