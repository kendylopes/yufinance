import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../domain/budget-permissions", () => ({
  canManageBudgets: vi.fn(),
}));

vi.mock("../infrastructure/budget-repository", () => ({
  findActiveBudgetByCategoryAndPeriod: vi.fn(),
  findActiveBudgetById: vi.fn(),
  updateActiveBudgetRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageBudgets } from "../domain/budget-permissions";
import {
  findActiveBudgetByCategoryAndPeriod,
  findActiveBudgetById,
  updateActiveBudgetRecord,
} from "../infrastructure/budget-repository";
import { updateBudget } from "./update-budget";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const canManageBudgetsMock = vi.mocked(canManageBudgets);

const findActiveBudgetByIdMock = vi.mocked(findActiveBudgetById);

const findActiveBudgetByCategoryAndPeriodMock = vi.mocked(findActiveBudgetByCategoryAndPeriod);

const updateActiveBudgetRecordMock = vi.mocked(updateActiveBudgetRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const budgetId = "660e8400-e29b-41d4-a716-446655440000";

const categoryId = "770e8400-e29b-41d4-a716-446655440000";

describe("updateBudget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro para entrada inválida", async () => {
    const result = await updateBudget({
      workspaceId,
      budgetId,
      month: 13,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result).toEqual({
      success: false,
      message: "O mês deve estar entre 1 e 12.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await updateBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });
  });

  it("retorna erro para usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await updateBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });
  });

  it("retorna erro para papel sem permissão", async () => {
    mockMembership("MEMBER");

    canManageBudgetsMock.mockReturnValue(false);

    const result = await updateBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para gerenciar orçamentos.",
    });

    expect(findActiveBudgetByIdMock).not.toHaveBeenCalled();
  });

  it("retorna erro quando o orçamento não existe", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockResolvedValue(null);

    const result = await updateBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Orçamento não encontrado.",
    });

    expect(updateActiveBudgetRecordMock).not.toHaveBeenCalled();
  });

  it("não verifica conflito quando o período não muda", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockResolvedValue(createBudgetFixture());

    updateActiveBudgetRecordMock.mockResolvedValue(
      createBudgetFixture({
        plannedAmount: "1500.0000",
      }),
    );

    await updateBudget({
      workspaceId,
      budgetId,
      month: 8,
      year: 2026,
      plannedAmount: 1500,
    });

    expect(findActiveBudgetByCategoryAndPeriodMock).not.toHaveBeenCalled();
  });

  it("retorna erro quando existe conflito no novo período", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockResolvedValue(createBudgetFixture());

    findActiveBudgetByCategoryAndPeriodMock.mockResolvedValue(
      createBudgetFixture({
        id: "880e8400-e29b-41d4-a716-446655440000",
        month: 9,
      }),
    );

    const result = await updateBudget({
      workspaceId,
      budgetId,
      month: 9,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result).toEqual({
      success: false,
      message: "Já existe um orçamento ativo para esta categoria no período informado.",
    });

    expect(updateActiveBudgetRecordMock).not.toHaveBeenCalled();
  });

  it("atualiza orçamento no novo período quando não existe conflito", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockResolvedValue(createBudgetFixture());

    findActiveBudgetByCategoryAndPeriodMock.mockResolvedValue(null);

    const updatedBudget = createBudgetFixture({
      month: 9,
      plannedAmount: "1500.0000",
    });

    updateActiveBudgetRecordMock.mockResolvedValue(updatedBudget);

    const result = await updateBudget({
      workspaceId,
      budgetId,
      month: 9,
      year: 2026,
      plannedAmount: 1500,
    });

    expect(result).toEqual({
      success: true,
      budget: updatedBudget,
    });

    expect(findActiveBudgetByCategoryAndPeriodMock).toHaveBeenCalledWith({
      workspaceId,
      categoryId,
      month: 9,
      year: 2026,
    });

    expect(updateActiveBudgetRecordMock).toHaveBeenCalledWith({
      budgetId,
      workspaceId,
      month: 9,
      year: 2026,
      plannedAmount: "1500.0000",
    });
  });

  it("normaliza valor planejado para quatro casas decimais", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockResolvedValue(createBudgetFixture());

    updateActiveBudgetRecordMock.mockResolvedValue(
      createBudgetFixture({
        plannedAmount: "1250.5000",
      }),
    );

    await updateBudget({
      workspaceId,
      budgetId,
      month: 8,
      year: 2026,
      plannedAmount: "1250.5",
    });

    expect(updateActiveBudgetRecordMock).toHaveBeenCalledWith({
      budgetId,
      workspaceId,
      month: 8,
      year: 2026,
      plannedAmount: "1250.5000",
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockAuthorizedUser();

    findActiveBudgetByIdMock.mockRejectedValue(new Error("Database error"));

    const result = await updateBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Não foi possível atualizar o orçamento. Tente novamente.",
    });
  });
});

function createValidInput() {
  return {
    workspaceId,
    budgetId,
    month: 8,
    year: 2026,
    plannedAmount: 1200,
  };
}

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

function mockMembership(role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER" = "OWNER") {
  mockCurrentUser();

  findWorkspaceMembershipMock.mockResolvedValue({
    workspaceId,
    userId: "user-1",
    role,
  });
}

function mockAuthorizedUser(role: "OWNER" | "ADMIN" = "OWNER") {
  mockMembership(role);
  canManageBudgetsMock.mockReturnValue(true);
}

function createBudgetFixture(
  overrides: Partial<{
    id: string;
    month: number;
    year: number;
    plannedAmount: string;
  }> = {},
) {
  return {
    id: overrides.id ?? budgetId,
    workspaceId,
    categoryId,
    month: overrides.month ?? 8,
    year: overrides.year ?? 2026,
    plannedAmount: overrides.plannedAmount ?? "1200.0000",
    archivedAt: null,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };
}
