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
  findActiveBudgetById: vi.fn(),
  archiveActiveBudgetRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageBudgets } from "../domain/budget-permissions";

import {
  archiveActiveBudgetRecord,
  findActiveBudgetById,
} from "../infrastructure/budget-repository";

import { archiveBudget } from "./archive-budget";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const membershipMock = vi.mocked(findWorkspaceMembership);

const permissionMock = vi.mocked(canManageBudgets);

const findBudgetMock = vi.mocked(findActiveBudgetById);

const archiveMock = vi.mocked(archiveActiveBudgetRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const budgetId = "660e8400-e29b-41d4-a716-446655440000";

describe("archiveBudget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro para entrada inválida", async () => {
    const result = await archiveBudget({
      workspaceId: "invalid",
      budgetId,
    });

    expect(result.success).toBe(false);

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await archiveBudget({
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

    const result = await archiveBudget({
      workspaceId,
      budgetId,
    });

    expect(result.success).toBe(false);
  });

  it("retorna erro para usuário sem permissão", async () => {
    mockMembership();

    permissionMock.mockReturnValue(false);

    const result = await archiveBudget({
      workspaceId,
      budgetId,
    });

    expect(result.success).toBe(false);

    expect(findBudgetMock).not.toHaveBeenCalled();
  });

  it("retorna erro quando orçamento não existe", async () => {
    mockAuthorizedUser();

    findBudgetMock.mockResolvedValue(null);

    const result = await archiveBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Orçamento não encontrado.",
    });

    expect(archiveMock).not.toHaveBeenCalled();
  });

  it("arquiva orçamento", async () => {
    mockAuthorizedUser();

    findBudgetMock.mockResolvedValue(createBudget());

    archiveMock.mockResolvedValue(createBudget());

    const result = await archiveBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: true,
      budgetId,
    });

    expect(archiveMock).toHaveBeenCalledWith({
      budgetId,
      workspaceId,
    });
  });

  it("retorna erro seguro para falha inesperada", async () => {
    mockAuthorizedUser();

    findBudgetMock.mockRejectedValue(new Error());

    const result = await archiveBudget({
      workspaceId,
      budgetId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível arquivar o orçamento. Tente novamente.",
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

function createBudget() {
  return {
    id: budgetId,
    workspaceId,
    categoryId: "770e8400-e29b-41d4-a716-446655440000",
    month: 8,
    year: 2026,
    plannedAmount: "1000.0000",
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
