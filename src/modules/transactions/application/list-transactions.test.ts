import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/transaction-repository", () => ({
  listActiveTransactionsByWorkspace: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { listActiveTransactionsByWorkspace } from "../infrastructure/transaction-repository";
import { listTransactions } from "./list-transactions";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const listActiveTransactionsByWorkspaceMock = vi.mocked(listActiveTransactionsByWorkspace);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

describe("listTransactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated user", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await listTransactions(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
  });

  it("rejects user without membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await listTransactions(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(listActiveTransactionsByWorkspaceMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)("allows %s", async (role) => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role,
    });

    listActiveTransactionsByWorkspaceMock.mockResolvedValue([]);

    const result = await listTransactions(workspaceId);

    expect(result).toEqual({
      success: true,
      transactions: [],
    });
  });

  it("returns active transactions", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    listActiveTransactionsByWorkspaceMock.mockResolvedValue([
      {
        id: "770e8400-e29b-41d4-a716-446655440000",
        workspaceId,
        financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
        categoryId: "660e8400-e29b-41d4-a716-446655440000",
        type: "EXPENSE",
        description: "Mercado",
        amount: "120.0000",
        occurredAt: new Date(),
        notes: null,
        canceledAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await listTransactions(workspaceId);

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Expected success.");
    }

    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0]?.description).toBe("Mercado");
  });

  it("returns repository error", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    listActiveTransactionsByWorkspaceMock.mockRejectedValue(new Error());

    const result = await listTransactions(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar as transações. Tente novamente.",
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
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
