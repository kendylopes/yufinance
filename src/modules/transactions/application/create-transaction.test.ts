import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/transaction-repository", () => ({
  createTransactionRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { createTransactionRecord } from "../infrastructure/transaction-repository";
import { createTransaction } from "./create-transaction";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const createTransactionRecordMock = vi.mocked(createTransactionRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

describe("createTransaction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns validation error", async () => {
    const result = await createTransaction({
      workspaceId,
      transaction: {} as never,
    });

    expect(result).toEqual({
      success: false,
      message: "Os dados informados não são válidos.",
    });
  });

  it("returns authentication error", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await createTransaction({
      workspaceId,
      transaction: validInput(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });
  });

  it("returns access error", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await createTransaction({
      workspaceId,
      transaction: validInput(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });
  });

  it.each(["VIEWER"] as const)("denies %s", async (role) => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role,
    });

    const result = await createTransaction({
      workspaceId,
      transaction: validInput(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para criar transações.",
    });
  });

  it.each(["OWNER", "ADMIN", "MEMBER"] as const)("creates transaction for %s", async (role) => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role,
    });

    createTransactionRecordMock.mockResolvedValue({
      id: "770e8400-e29b-41d4-a716-446655440000",
    });

    const result = await createTransaction({
      workspaceId,
      transaction: validInput(),
    });

    expect(result).toEqual({
      success: true,
      transactionId: "770e8400-e29b-41d4-a716-446655440000",
    });
  });

  it("returns generic repository error", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    createTransactionRecordMock.mockRejectedValue(new Error());

    const result = await createTransaction({
      workspaceId,
      transaction: validInput(),
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível criar a transação. Tente novamente.",
    });
  });
});

function validInput() {
  return {
    financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
    categoryId: "660e8400-e29b-41d4-a716-446655440000",
    type: "EXPENSE" as const,
    description: "Mercado",
    amount: 100,
    occurredAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
