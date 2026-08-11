import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../domain/budget-permissions", () => ({
  canReadBudgets: vi.fn(),
}));

vi.mock("../domain/calculate-budget-progress", () => ({
  calculateBudgetProgress: vi.fn(),
}));

vi.mock("../infrastructure/budget-repository", () => ({
  findActiveBudgetById: vi.fn(),
  getBudgetProgressRecordById: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";
import { canReadBudgets } from "../domain/budget-permissions";
import { calculateBudgetProgress } from "../domain/calculate-budget-progress";
import {
  findActiveBudgetById,
  getBudgetProgressRecordById,
} from "../infrastructure/budget-repository";
import { getBudget } from "./get-budget";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const canReadBudgetsMock = vi.mocked(canReadBudgets);

const calculateBudgetProgressMock = vi.mocked(calculateBudgetProgress);

const findActiveBudgetByIdMock = vi.mocked(findActiveBudgetById);

const getBudgetProgressRecordByIdMock = vi.mocked(getBudgetProgressRecordById);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const budgetId = "660e8400-e29b-41d4-a716-446655440000";

const categoryId = "770e8400-e29b-41d4-a716-446655440000";

describe("getBudget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro para entrada inválida", async () => {
    const result = await getBudget({
      workspaceId: "invalid",
      budgetId,
    });

    expect(result.success).toBe(false);

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await getBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });
  });

  it("retorna erro para usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await getBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });
  });

  it("retorna erro para papel sem leitura", async () => {
    mockMembership();

    canReadBudgetsMock.mockReturnValue(false);

    const result = await getBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para consultar orçamentos.",
    });
  });

  it("retorna erro quando o orçamento não existe", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockResolvedValue(null);

    const result = await getBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Orçamento não encontrado.",
    });

    expect(getBudgetProgressRecordByIdMock).not.toHaveBeenCalled();
  });

  it("retorna orçamento com progresso calculado", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockResolvedValue(createBudgetFixture());

    getBudgetProgressRecordByIdMock.mockResolvedValue(createProgressRecordFixture());

    calculateBudgetProgressMock.mockReturnValue({
      plannedAmount: "1000.0000",
      spentAmount: "500.0000",
      remainingAmount: "500.0000",
      percentage: 50,
      status: "ON_TRACK",
    });

    const result = await getBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: true,
      budget: {
        id: budgetId,
        workspaceId,
        categoryId,
        categoryName: "Alimentação",
        month: 8,
        year: 2026,
        plannedAmount: "1000.0000",
        spentAmount: "500.0000",
        remainingAmount: "500.0000",
        percentage: 50,
        status: "ON_TRACK",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });

    expect(getBudgetProgressRecordByIdMock).toHaveBeenCalledWith({
      workspaceId,
      budgetId,
      startDate: new Date("2026-08-01T00:00:00.000Z"),
      endDate: new Date("2026-09-01T00:00:00.000Z"),
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockRejectedValue(new Error("Database error"));

    const result = await getBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar o orçamento. Tente novamente.",
    });
  });
});

function mockCurrentUser() {
  getCurrentUserMock.mockResolvedValue({
    id: "user-1",
    name: "Kennedy",
    email: "kennedy@example.com",
    emailVerified: false,
    image: null,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  });
}

function mockMembership() {
  mockCurrentUser();

  findWorkspaceMembershipMock.mockResolvedValue({
    workspaceId,
    userId: "user-1",
    role: "OWNER",
  });
}

function mockAuthorizedUser() {
  mockMembership();
  canReadBudgetsMock.mockReturnValue(true);
}

function createBudgetFixture() {
  return {
    id: budgetId,
    workspaceId,
    categoryId,
    month: 8,
    year: 2026,
    plannedAmount: "1000.0000",
    archivedAt: null,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };
}

function createProgressRecordFixture() {
  return {
    id: budgetId,
    workspaceId,
    categoryId,
    categoryName: "Alimentação",
    month: 8,
    year: 2026,
    plannedAmount: "1000.0000",
    spentAmount: "500.0000",
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };
}
