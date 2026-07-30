import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/financial-account-repository", () => ({
  archiveActiveFinancialAccountRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { archiveActiveFinancialAccountRecord } from "../infrastructure/financial-account-repository";
import { archiveFinancialAccount } from "./archive-financial-account";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const archiveActiveFinancialAccountRecordMock = vi.mocked(archiveActiveFinancialAccountRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const financialAccountId = "660e8400-e29b-41d4-a716-446655440000";

describe("archiveFinancialAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await archiveFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await archiveFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(archiveActiveFinancialAccountRecordMock).not.toHaveBeenCalled();
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede arquivamento para Role %s", async (role) => {
    mockMembership(role);

    const result = await archiveFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para arquivar contas financeiras.",
    });

    expect(archiveActiveFinancialAccountRecordMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN"] as const)("permite arquivamento para Role %s", async (role) => {
    mockMembership(role);

    archiveActiveFinancialAccountRecordMock.mockResolvedValue(financialAccount());

    const result = await archiveFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: true,
    });

    expect(archiveActiveFinancialAccountRecordMock).toHaveBeenCalledWith({
      workspaceId,
      financialAccountId,
    });
  });

  it("retorna não encontrada quando a conta não pode ser arquivada", async () => {
    mockMembership("OWNER");

    archiveActiveFinancialAccountRecordMock.mockResolvedValue(null);

    const result = await archiveFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Conta financeira não encontrada.",
    });
  });

  it("retorna erro seguro quando a persistência falha", async () => {
    mockMembership("OWNER");

    archiveActiveFinancialAccountRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await archiveFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível arquivar a conta financeira. Tente novamente.",
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

function financialAccount() {
  return {
    id: financialAccountId,
    workspaceId,
    name: "Nubank Principal",
    type: "CHECKING" as const,
    initialBalance: "1500.2500",
    currency: "BRL",
    archivedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
