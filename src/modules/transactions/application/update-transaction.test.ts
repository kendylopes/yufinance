import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("@/modules/financial-accounts/infrastructure/financial-account-repository", () => ({
  findActiveFinancialAccountById: vi.fn(),
}));

vi.mock("@/modules/categories/infrastructure/category-repository", () => ({
  findActiveCategoryById: vi.fn(),
}));

vi.mock("../infrastructure/transaction-repository", () => ({
  updateActiveTransactionRecord: vi.fn(),
}));

import { findActiveCategoryById } from "@/modules/categories/infrastructure/category-repository";
import { findActiveFinancialAccountById } from "@/modules/financial-accounts/infrastructure/financial-account-repository";
import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { updateActiveTransactionRecord } from "../infrastructure/transaction-repository";
import { updateTransaction } from "./update-transaction";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const findActiveFinancialAccountByIdMock = vi.mocked(findActiveFinancialAccountById);

const findActiveCategoryByIdMock = vi.mocked(findActiveCategoryById);

const updateActiveTransactionRecordMock = vi.mocked(updateActiveTransactionRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const transactionId = "770e8400-e29b-41d4-a716-446655440000";

describe("updateTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation error", async () => {
    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: {} as never,
    });

    expect(result).toEqual({
      success: false,
      message: "Os dados informados não são válidos.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("returns authentication error", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expectErrorResult(result, "Você precisa estar autenticado para continuar.");

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
  });

  it("returns access error", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expectErrorResult(result, "Você não possui acesso a este espaço financeiro.");

    expect(findActiveFinancialAccountByIdMock).not.toHaveBeenCalled();
  });

  it("denies VIEWER", async () => {
    mockMembership("VIEWER");

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expectErrorResult(result, "Você não possui permissão para editar transações.");

    expect(findActiveFinancialAccountByIdMock).not.toHaveBeenCalled();
  });

  it("returns account not found", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockResolvedValue(null);

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expectErrorResult(result, "Conta financeira ativa não encontrada.");

    expect(findActiveFinancialAccountByIdMock).toHaveBeenCalledWith(
      validInput().financialAccountId,
      workspaceId,
    );

    expect(findActiveCategoryByIdMock).not.toHaveBeenCalled();
  });

  it("returns category not found", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockResolvedValue(activeFinancialAccount());

    findActiveCategoryByIdMock.mockResolvedValue(null);

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expectErrorResult(result, "Categoria ativa não encontrada.");

    expect(findActiveCategoryByIdMock).toHaveBeenCalledWith(validInput().categoryId, workspaceId);

    expect(updateActiveTransactionRecordMock).not.toHaveBeenCalled();
  });

  it("returns category type mismatch", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockResolvedValue(activeFinancialAccount());

    findActiveCategoryByIdMock.mockResolvedValue(activeCategory("INCOME"));

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expectErrorResult(result, "O tipo da categoria não corresponde ao tipo da transação.");

    expect(updateActiveTransactionRecordMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN", "MEMBER"] as const)("updates transaction for %s", async (role) => {
    mockMembership(role);

    findActiveFinancialAccountByIdMock.mockResolvedValue(activeFinancialAccount());

    findActiveCategoryByIdMock.mockResolvedValue(activeCategory("EXPENSE"));

    updateActiveTransactionRecordMock.mockResolvedValue(activeTransaction());

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expect(result).toEqual({
      success: true,
      transactionId,
    });

    expect(updateActiveTransactionRecordMock).toHaveBeenCalledWith({
      workspaceId,
      transactionId,
      transaction: {
        financialAccountId: validInput().financialAccountId,
        categoryId: validInput().categoryId,
        type: "EXPENSE",
        description: "Mercado",
        amount: "120.0000",
        occurredAt: validInput().occurredAt,
        notes: null,
      },
    });
  });

  it("returns not found when the active transaction does not exist", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockResolvedValue(activeFinancialAccount());

    findActiveCategoryByIdMock.mockResolvedValue(activeCategory("EXPENSE"));

    updateActiveTransactionRecordMock.mockResolvedValue(null);

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expectErrorResult(result, "Transação não encontrada.");
  });

  it("returns repository error", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockResolvedValue(activeFinancialAccount());

    findActiveCategoryByIdMock.mockResolvedValue(activeCategory("EXPENSE"));

    updateActiveTransactionRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await updateTransaction({
      workspaceId,
      transactionId,
      transaction: validInput(),
    });

    expectErrorResult(result, "Não foi possível atualizar a transação. Tente novamente.");
  });
});

function validInput() {
  return {
    financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
    categoryId: "660e8400-e29b-41d4-a716-446655440000",
    type: "EXPENSE" as const,
    description: "Mercado",
    amount: 120,
    occurredAt: new Date("2026-08-03T12:00:00.000Z"),
    notes: "",
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

function mockMembership(role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER") {
  mockCurrentUser();

  findWorkspaceMembershipMock.mockResolvedValue({
    workspaceId,
    userId: "user-1",
    role,
  });
}

function activeFinancialAccount() {
  return {
    id: validInput().financialAccountId,
    workspaceId,
    name: "Conta principal",
    type: "CHECKING" as const,
    initialBalance: "0.0000",
    currency: "BRL",
    archivedAt: null,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };
}

function activeCategory(type: "INCOME" | "EXPENSE") {
  return {
    id: validInput().categoryId,
    workspaceId,
    name: "Alimentação",
    type,
    archivedAt: null,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };
}

function activeTransaction() {
  return {
    id: transactionId,
    workspaceId,
    financialAccountId: validInput().financialAccountId,
    categoryId: validInput().categoryId,
    type: "EXPENSE" as const,
    description: "Mercado",
    amount: "120.0000",
    occurredAt: validInput().occurredAt,
    notes: null,
    canceledAt: null,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-03T12:00:00.000Z"),
  };
}

function expectErrorResult(result: Awaited<ReturnType<typeof updateTransaction>>, message: string) {
  expect(result.success).toBe(false);

  if (result.success) {
    throw new Error("Era esperado erro.");
  }

  expect(result.message).toBe(message);
}
