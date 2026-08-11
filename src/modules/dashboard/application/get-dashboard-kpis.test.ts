import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("./get-dashboard-context", () => ({
  getDashboardContext: vi.fn(),
}));

vi.mock("../infrastructure/dashboard-kpis.repository", () => ({
  getDashboardKpisRecord: vi.fn(),
}));

import { getDashboardKpisRecord } from "../infrastructure/dashboard-kpis.repository";
import { getDashboardContext } from "./get-dashboard-context";
import { getDashboardKpis } from "./get-dashboard-kpis";

const getDashboardContextMock = vi.mocked(getDashboardContext);

const getDashboardKpisRecordMock = vi.mocked(getDashboardKpisRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const referenceDate = new Date("2026-08-15T12:00:00.000Z");

const startDate = new Date(2026, 7, 1, 0, 0, 0, 0);

describe("getDashboardKpis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("propaga erro retornado pelo contexto", async () => {
    getDashboardContextMock.mockResolvedValue({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    const result = await getDashboardKpis({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(getDashboardKpisRecordMock).not.toHaveBeenCalled();
  });

  it("envia período e data de referência para o contexto", async () => {
    mockContext();

    getDashboardKpisRecordMock.mockResolvedValue({
      activeAccountsCount: 0,
      activeCategoriesCount: 0,
      periodTransactionsCount: 0,
      lastMovementAt: null,
    });

    await getDashboardKpis({
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

  it("retorna os indicadores do Dashboard", async () => {
    mockContext();

    const lastMovementAt = new Date("2026-08-12T18:00:00.000Z");

    getDashboardKpisRecordMock.mockResolvedValue({
      activeAccountsCount: 3,
      activeCategoriesCount: 12,
      periodTransactionsCount: 41,
      lastMovementAt,
    });

    const result = await getDashboardKpis({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      kpis: {
        activeAccountsCount: 3,
        activeCategoriesCount: 12,
        periodTransactionsCount: 41,
        lastMovementAt,
      },
    });

    expect(getDashboardKpisRecordMock).toHaveBeenCalledWith({
      workspaceId,
      startDate,
      endDate: referenceDate,
    });
  });

  it("retorna indicadores zerados", async () => {
    mockContext();

    getDashboardKpisRecordMock.mockResolvedValue({
      activeAccountsCount: 0,
      activeCategoriesCount: 0,
      periodTransactionsCount: 0,
      lastMovementAt: null,
    });

    const result = await getDashboardKpis({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      kpis: {
        activeAccountsCount: 0,
        activeCategoriesCount: 0,
        periodTransactionsCount: 0,
        lastMovementAt: null,
      },
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockContext();

    getDashboardKpisRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await getDashboardKpis({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar os indicadores do Dashboard. Tente novamente.",
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
