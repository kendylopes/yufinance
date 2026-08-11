import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/transaction-repository", () => ({
  cancelActiveTransactionRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { cancelActiveTransactionRecord } from "../infrastructure/transaction-repository";
import { cancelTransaction } from "./cancel-transaction";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);
const cancelActiveTransactionRecordMock = vi.mocked(cancelActiveTransactionRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const transactionId = "770e8400-e29b-41d4-a716-446655440000";

describe("cancelTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns authentication error", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await cancelTransaction({
      workspaceId,
      transactionId,
    });

    expectError(result, "Você precisa estar autenticado para continuar.");
  });

  it("returns access error", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await cancelTransaction({
      workspaceId,
      transactionId,
    });

    expectError(result, "Você não possui acesso a este espaço financeiro.");
  });

  it("denies VIEWER", async () => {
    mockMembership("VIEWER");

    const result = await cancelTransaction({
      workspaceId,
      transactionId,
    });

    expectError(result, "Você não possui permissão para cancelar transações.");
  });

  it.each(["OWNER", "ADMIN", "MEMBER"] as const)("allows %s", async (role) => {
    mockMembership(role);

    cancelActiveTransactionRecordMock.mockResolvedValue({
      id: transactionId,
    } as never);

    const result = await cancelTransaction({
      workspaceId,
      transactionId,
    });

    expect(result).toEqual({
      success: true,
    });
  });

  it("returns not found", async () => {
    mockMembership("OWNER");

    cancelActiveTransactionRecordMock.mockResolvedValue(null);

    const result = await cancelTransaction({
      workspaceId,
      transactionId,
    });

    expectError(result, "Transação ativa não encontrada.");
  });

  it("returns repository error", async () => {
    mockMembership("OWNER");

    cancelActiveTransactionRecordMock.mockRejectedValue(new Error());

    const result = await cancelTransaction({
      workspaceId,
      transactionId,
    });

    expectError(result, "Não foi possível cancelar a transação. Tente novamente.");
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

function mockMembership(role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER") {
  mockCurrentUser();

  findWorkspaceMembershipMock.mockResolvedValue({
    workspaceId,
    userId: "user-1",
    role,
  });
}

function expectError(result: Awaited<ReturnType<typeof cancelTransaction>>, message: string) {
  expect(result.success).toBe(false);

  if (result.success) {
    throw new Error("Era esperado erro.");
  }

  expect(result.message).toBe(message);
}
