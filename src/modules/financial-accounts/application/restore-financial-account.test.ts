import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/financial-account-repository", () => ({
  restoreArchivedFinancialAccountRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { restoreArchivedFinancialAccountRecord } from "../infrastructure/financial-account-repository";
import { restoreFinancialAccount } from "./restore-financial-account";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const restoreArchivedFinancialAccountRecordMock = vi.mocked(restoreArchivedFinancialAccountRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const financialAccountId = "660e8400-e29b-41d4-a716-446655440000";

describe("restoreFinancialAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await restoreFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();

    expect(restoreArchivedFinancialAccountRecordMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await restoreFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(restoreArchivedFinancialAccountRecordMock).not.toHaveBeenCalled();
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede restauração para Role %s", async (role) => {
    mockMembership(role);

    const result = await restoreFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para restaurar contas financeiras.",
    });

    expect(restoreArchivedFinancialAccountRecordMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN"] as const)("permite restauração para Role %s", async (role) => {
    mockMembership(role);

    restoreArchivedFinancialAccountRecordMock.mockResolvedValue(restoredFinancialAccount());

    const result = await restoreFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: true,
    });

    expect(restoreArchivedFinancialAccountRecordMock).toHaveBeenCalledWith({
      workspaceId,
      financialAccountId,
    });
  });

  it("retorna não encontrada quando a conta arquivada não pode ser restaurada", async () => {
    mockMembership("OWNER");

    restoreArchivedFinancialAccountRecordMock.mockResolvedValue(null);

    const result = await restoreFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Conta financeira arquivada não encontrada.",
    });
  });

  it("retorna erro seguro quando a persistência falha", async () => {
    mockMembership("OWNER");

    restoreArchivedFinancialAccountRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await restoreFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível restaurar a conta financeira. Tente novamente.",
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

function mockMembership(role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER") {
  mockCurrentUser();

  findWorkspaceMembershipMock.mockResolvedValue({
    workspaceId,
    userId: "user-1",
    role,
  });
}

function restoredFinancialAccount() {
  return {
    id: financialAccountId,
    workspaceId,
    name: "Nubank Principal",
    type: "CHECKING" as const,
    initialBalance: "1500.2500",
    currency: "BRL",
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
