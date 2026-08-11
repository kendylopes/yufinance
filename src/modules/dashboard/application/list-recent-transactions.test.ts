import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("./get-dashboard-context", () => ({
  getDashboardContext: vi.fn(),
}));

vi.mock("../infrastructure/dashboard-repository", () => ({
  listRecentTransactionsRecord: vi.fn(),
}));

import { listRecentTransactionsRecord } from "../infrastructure/dashboard-repository";
import { getDashboardContext } from "./get-dashboard-context";
import { listRecentTransactions } from "./list-recent-transactions";

const getDashboardContextMock = vi.mocked(getDashboardContext);

const listRecentTransactionsRecordMock = vi.mocked(listRecentTransactionsRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const referenceDate = new Date("2026-08-15T12:00:00.000Z");

const startDate = new Date(2026, 7, 1, 0, 0, 0, 0);

describe("listRecentTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propaga erro retornado pelo contexto", async () => {
    getDashboardContextMock.mockResolvedValue({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    const result = await listRecentTransactions({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(listRecentTransactionsRecordMock).not.toHaveBeenCalled();
  });

  it("envia período e data de referência para o contexto", async () => {
    mockContext();

    listRecentTransactionsRecordMock.mockResolvedValue([]);

    await listRecentTransactions({
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

  it("retorna uma lista vazia", async () => {
    mockContext();

    listRecentTransactionsRecordMock.mockResolvedValue([]);

    const result = await listRecentTransactions({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      transactions: [],
    });

    expect(listRecentTransactionsRecordMock).toHaveBeenCalledWith({
      workspaceId,
      limit: undefined,
    });
  });

  it("retorna as transações recentes transformadas", async () => {
    mockContext();

    const occurredAt = new Date("2026-08-04T12:00:00.000Z");

    listRecentTransactionsRecordMock.mockResolvedValue([
      {
        id: "660e8400-e29b-41d4-a716-446655440000",
        description: "Investimento de julho",
        category: "CDB",
        financialAccount: "Nubank Principal",
        type: "INCOME",
        amount: "150.0000",
        occurredAt,
        canceledAt: null,
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440000",
        description: "Mercado",
        category: "Alimentação",
        financialAccount: "Nubank Principal",
        type: "EXPENSE",
        amount: "120.0000",
        occurredAt,
        canceledAt: new Date("2026-08-04T14:00:00.000Z"),
      },
    ]);

    const result = await listRecentTransactions({
      workspaceId,
      referenceDate,
      limit: 5,
    });

    expect(result).toEqual({
      success: true,
      transactions: [
        {
          id: "660e8400-e29b-41d4-a716-446655440000",
          description: "Investimento de julho",
          category: "CDB",
          financialAccount: "Nubank Principal",
          type: "INCOME",
          amount: "150.0000",
          occurredAt,
          canceled: false,
        },
        {
          id: "770e8400-e29b-41d4-a716-446655440000",
          description: "Mercado",
          category: "Alimentação",
          financialAccount: "Nubank Principal",
          type: "EXPENSE",
          amount: "120.0000",
          occurredAt,
          canceled: true,
        },
      ],
    });

    expect(listRecentTransactionsRecordMock).toHaveBeenCalledWith({
      workspaceId,
      limit: 5,
    });
  });

  it("usa o limite informado", async () => {
    mockContext();

    listRecentTransactionsRecordMock.mockResolvedValue([]);

    await listRecentTransactions({
      workspaceId,
      referenceDate,
      limit: 3,
    });

    expect(listRecentTransactionsRecordMock).toHaveBeenCalledWith({
      workspaceId,
      limit: 3,
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockContext();

    listRecentTransactionsRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await listRecentTransactions({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar as transações recentes. Tente novamente.",
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
