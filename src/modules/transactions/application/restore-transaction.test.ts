import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/transaction-repository", () => ({
  restoreCanceledTransactionRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { restoreCanceledTransactionRecord } from "../infrastructure/transaction-repository";
import { restoreTransaction } from "./restore-transaction";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);
const restoreCanceledTransactionRecordMock = vi.mocked(restoreCanceledTransactionRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const transactionId = "770e8400-e29b-41d4-a716-446655440000";

describe("restoreTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns authentication error", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    expectError(
      await restoreTransaction({ workspaceId, transactionId }),
      "Você precisa estar autenticado para continuar.",
    );
  });

  it("returns access error", async () => {
    mockMembership(null);

    expectError(
      await restoreTransaction({ workspaceId, transactionId }),
      "Você não possui acesso a este espaço financeiro.",
    );
  });

  it("denies VIEWER", async () => {
    mockMembership("VIEWER");

    expectError(
      await restoreTransaction({ workspaceId, transactionId }),
      "Você não possui permissão para restaurar transações.",
    );
  });

  it.each(["OWNER", "ADMIN", "MEMBER"] as const)("restores for %s", async (role) => {
    mockMembership(role);

    restoreCanceledTransactionRecordMock.mockResolvedValue({
      id: transactionId,
    } as never);

    expect(await restoreTransaction({ workspaceId, transactionId })).toEqual({
      success: true,
    });
  });

  it("returns not found", async () => {
    mockMembership("OWNER");

    restoreCanceledTransactionRecordMock.mockResolvedValue(null);

    expectError(
      await restoreTransaction({ workspaceId, transactionId }),
      "Transação cancelada não encontrada.",
    );
  });

  it("returns repository error", async () => {
    mockMembership("OWNER");

    restoreCanceledTransactionRecordMock.mockRejectedValue(new Error());

    expectError(
      await restoreTransaction({ workspaceId, transactionId }),
      "Não foi possível restaurar a transação. Tente novamente.",
    );
  });
});

function mockMembership(role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER" | null) {
  getCurrentUserMock.mockResolvedValue({
    id: "user-1",
    name: "Kennedy",
    email: "kennedy@example.com",
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  findWorkspaceMembershipMock.mockResolvedValue(
    role
      ? {
          workspaceId,
          userId: "user-1",
          role,
        }
      : null,
  );
}

function expectError(result: Awaited<ReturnType<typeof restoreTransaction>>, message: string) {
  expect(result.success).toBe(false);

  if (result.success) {
    throw new Error("Era esperado erro.");
  }

  expect(result.message).toBe(message);
}
