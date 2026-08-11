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
  findArchivedBudgetById: vi.fn(),
  findActiveBudgetByCategoryAndPeriod: vi.fn(),
  restoreArchivedBudgetRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageBudgets } from "../domain/budget-permissions";

import {
  findActiveBudgetByCategoryAndPeriod,
  findArchivedBudgetById,
  restoreArchivedBudgetRecord,
} from "../infrastructure/budget-repository";

import { restoreBudget } from "./restore-budget";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const membershipMock = vi.mocked(findWorkspaceMembership);

const permissionMock = vi.mocked(canManageBudgets);

const findArchivedMock = vi.mocked(findArchivedBudgetById);

const findActiveMock = vi.mocked(findActiveBudgetByCategoryAndPeriod);

const restoreMock = vi.mocked(restoreArchivedBudgetRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const budgetId = "660e8400-e29b-41d4-a716-446655440000";

const categoryId = "770e8400-e29b-41d4-a716-446655440000";

describe("restoreBudget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro para entrada inválida", async () => {
    const result = await restoreBudget({
      workspaceId: "invalid",
      budgetId,
    });

    expect(result.success).toBe(false);

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await restoreBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });
  });

  it("retorna erro para usuário sem membership", async () => {
    mockCurrentUser();

    membershipMock.mockResolvedValue(null);

    const result = await restoreBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(permissionMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário sem permissão", async () => {
    mockMembership();

    permissionMock.mockReturnValue(false);

    const result = await restoreBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para gerenciar orçamentos.",
    });

    expect(findArchivedMock).not.toHaveBeenCalled();
  });

  it("retorna erro quando orçamento arquivado não existe", async () => {
    mockAuthorizedUser();

    findArchivedMock.mockResolvedValue(null);

    const result = await restoreBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Orçamento arquivado não encontrado.",
    });

    expect(findActiveMock).not.toHaveBeenCalled();

    expect(restoreMock).not.toHaveBeenCalled();
  });

  it("impede restauração quando existe orçamento ativo para o mesmo período", async () => {
    mockAuthorizedUser();

    findArchivedMock.mockResolvedValue(createArchivedBudget());

    findActiveMock.mockResolvedValue(createActiveBudget());

    const result = await restoreBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Já existe um orçamento ativo para esta categoria no período informado.",
    });

    expect(restoreMock).not.toHaveBeenCalled();
  });

  it("restaura orçamento arquivado", async () => {
    mockAuthorizedUser();

    findArchivedMock.mockResolvedValue(createArchivedBudget());

    findActiveMock.mockResolvedValue(null);

    restoreMock.mockResolvedValue(createRestoredBudget());

    const result = await restoreBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: true,
      budgetId,
    });

    expect(restoreMock).toHaveBeenCalledWith({
      budgetId,
      workspaceId,
    });
  });

  it("retorna erro seguro quando Repository falha", async () => {
    mockAuthorizedUser();

    findArchivedMock.mockRejectedValue(new Error("Database error"));

    const result = await restoreBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível restaurar o orçamento. Tente novamente.",
    });
  });
});

function mockCurrentUser() {
  getCurrentUserMock.mockResolvedValue({
    id: "user-1",
    name: "Kennedy",
    email: "kennedy@test.com",
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

function mockMembership() {
  mockCurrentUser();

  membershipMock.mockResolvedValue({
    workspaceId,
    userId: "user-1",
    role: "OWNER",
  });
}

function mockAuthorizedUser() {
  mockMembership();

  permissionMock.mockReturnValue(true);
}

function createArchivedBudget() {
  return {
    id: budgetId,
    workspaceId,
    categoryId,
    month: 8,
    year: 2026,
    plannedAmount: "1000.0000",
    archivedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createActiveBudget() {
  return {
    id: "990e8400-e29b-41d4-a716-446655440000",
    workspaceId,
    categoryId,
    month: 8,
    year: 2026,
    plannedAmount: "1000.0000",
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createRestoredBudget() {
  return {
    id: budgetId,
    workspaceId,
    categoryId,
    month: 8,
    year: 2026,
    plannedAmount: "1000.0000",
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
