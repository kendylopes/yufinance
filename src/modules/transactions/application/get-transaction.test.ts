import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/transaction-repository", () => ({
  findActiveTransactionById: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { findActiveTransactionById } from "../infrastructure/transaction-repository";
import { getTransaction } from "./get-transaction";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const findActiveTransactionByIdMock = vi.mocked(findActiveTransactionById);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const transactionId = "770e8400-e29b-41d4-a716-446655440000";

describe("getTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated user", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await getTransaction({
      workspaceId,
      transactionId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });
  });

  it("rejects user without membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await getTransaction({
      workspaceId,
      transactionId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });
  });

  it("returns not found", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    findActiveTransactionByIdMock.mockResolvedValue(null);

    const result = await getTransaction({
      workspaceId,
      transactionId,
    });

    expect(result).toEqual({
      success: false,
      message: "Transação não encontrada.",
    });
  });

  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)(
    "returns transaction for %s",
    async (role) => {
      mockCurrentUser();

      findWorkspaceMembershipMock.mockResolvedValue({
        workspaceId,
        userId: "user-1",
        role,
      });

      findActiveTransactionByIdMock.mockResolvedValue({
        id: transactionId,
        workspaceId,
        financialAccountId: "11111111-1111-4111-8111-111111111111",
        categoryId: "22222222-2222-4222-8222-222222222222",
        type: "EXPENSE",
        description: "Mercado",
        amount: "120.0000",
        occurredAt: new Date(),
        notes: null,
        canceledAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await getTransaction({
        workspaceId,
        transactionId,
      });

      expect(result.success).toBe(true);

      if (!result.success) {
        throw new Error("Expected success");
      }

      expect(result.transaction.description).toBe("Mercado");
    },
  );

  it("returns repository error", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    findActiveTransactionByIdMock.mockRejectedValue(new Error());

    const result = await getTransaction({
      workspaceId,
      transactionId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar a transação. Tente novamente.",
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
