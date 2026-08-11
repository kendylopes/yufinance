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
  createBudgetRecord: vi.fn(),
  findActiveBudgetByCategoryAndPeriod: vi.fn(),
  findActiveExpenseCategoryById: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageBudgets } from "../domain/budget-permissions";
import {
  createBudgetRecord,
  findActiveBudgetByCategoryAndPeriod,
  findActiveExpenseCategoryById,
} from "../infrastructure/budget-repository";
import { createBudget } from "./create-budget";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const canManageBudgetsMock = vi.mocked(canManageBudgets);

const createBudgetRecordMock = vi.mocked(createBudgetRecord);

const findActiveBudgetByCategoryAndPeriodMock = vi.mocked(findActiveBudgetByCategoryAndPeriod);

const findActiveExpenseCategoryByIdMock = vi.mocked(findActiveExpenseCategoryById);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const categoryId = "660e8400-e29b-41d4-a716-446655440000";

describe("createBudget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro para entrada inválida", async () => {
    const result = await createBudget({
      workspaceId,
      categoryId,
      month: 13,
      year: 2026,
      plannedAmount: 1000,
    });

    expect(result).toEqual({
      success: false,
      message: "O mês deve estar entre 1 e 12.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await createBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await createBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(canManageBudgetsMock).not.toHaveBeenCalled();
  });

  it("retorna erro para papel sem permissão de gerenciamento", async () => {
    mockMembership("MEMBER");

    canManageBudgetsMock.mockReturnValue(false);

    const result = await createBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para gerenciar orçamentos.",
    });

    expect(findActiveExpenseCategoryByIdMock).not.toHaveBeenCalled();
  });

  it("retorna erro para categoria inválida, arquivada ou não pertencente a despesas", async () => {
    mockAuthorizedUser();

    findActiveExpenseCategoryByIdMock.mockResolvedValue(null);

    const result = await createBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message:
        "A categoria informada não existe, está arquivada ou não é uma categoria de despesa.",
    });

    expect(findActiveBudgetByCategoryAndPeriodMock).not.toHaveBeenCalled();
  });

  it("retorna erro quando já existe orçamento ativo para a categoria e período", async () => {
    mockAuthorizedUser();

    findActiveExpenseCategoryByIdMock.mockResolvedValue({
      id: categoryId,
      name: "Alimentação",
    });

    findActiveBudgetByCategoryAndPeriodMock.mockResolvedValue(createBudgetRecordFixture());

    const result = await createBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Já existe um orçamento ativo para esta categoria no período informado.",
    });

    expect(createBudgetRecordMock).not.toHaveBeenCalled();
  });

  it("cria orçamento para OWNER", async () => {
    mockAuthorizedUser("OWNER");

    mockSuccessfulDependencies();

    const createdBudget = createBudgetRecordFixture();

    createBudgetRecordMock.mockResolvedValue(createdBudget);

    const result = await createBudget(createValidInput());

    expect(result).toEqual({
      success: true,
      budget: createdBudget,
    });

    expect(createBudgetRecordMock).toHaveBeenCalledWith({
      workspaceId,
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: "1200.0000",
    });
  });

  it("cria orçamento para ADMIN", async () => {
    mockAuthorizedUser("ADMIN");

    mockSuccessfulDependencies();

    createBudgetRecordMock.mockResolvedValue(createBudgetRecordFixture());

    const result = await createBudget(createValidInput());

    expect(result.success).toBe(true);
  });

  it("normaliza o valor planejado para quatro casas decimais", async () => {
    mockAuthorizedUser();

    mockSuccessfulDependencies();

    createBudgetRecordMock.mockResolvedValue(
      createBudgetRecordFixture({
        plannedAmount: "1250.5000",
      }),
    );

    await createBudget({
      workspaceId,
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: "1250.5",
    });

    expect(createBudgetRecordMock).toHaveBeenCalledWith({
      workspaceId,
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: "1250.5000",
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockAuthorizedUser();

    mockSuccessfulDependencies();

    createBudgetRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await createBudget(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Não foi possível criar o orçamento. Tente novamente.",
    });
  });
});

function createValidInput() {
  return {
    workspaceId,
    categoryId,
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

function mockSuccessfulDependencies() {
  findActiveExpenseCategoryByIdMock.mockResolvedValue({
    id: categoryId,
    name: "Alimentação",
  });

  findActiveBudgetByCategoryAndPeriodMock.mockResolvedValue(null);
}

function createBudgetRecordFixture(
  overrides: Partial<{
    plannedAmount: string;
  }> = {},
) {
  return {
    id: "770e8400-e29b-41d4-a716-446655440000",
    workspaceId,
    categoryId,
    month: 8,
    year: 2026,
    plannedAmount: overrides.plannedAmount ?? "1200.0000",
    archivedAt: null,
    createdAt: new Date("2026-08-07T10:00:00.000Z"),
    updatedAt: new Date("2026-08-07T10:00:00.000Z"),
  };
}
