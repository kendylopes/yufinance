import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/financial-account-repository", () => ({
  updateActiveFinancialAccountRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { updateActiveFinancialAccountRecord } from "../infrastructure/financial-account-repository";
import { updateFinancialAccount } from "./update-financial-account";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const updateActiveFinancialAccountRecordMock = vi.mocked(updateActiveFinancialAccountRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const financialAccountId = "660e8400-e29b-41d4-a716-446655440000";

describe("updateFinancialAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita dados inválidos", async () => {
    const result = await updateFinancialAccount({
      workspaceId,
      financialAccountId,
      data: {
        name: "N",
        type: "DIGITAL",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Os dados informados não são válidos.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await updateFinancialAccount({
      workspaceId,
      financialAccountId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await updateFinancialAccount({
      workspaceId,
      financialAccountId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(updateActiveFinancialAccountRecordMock).not.toHaveBeenCalled();
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede edição para Role %s", async (role) => {
    mockMembership(role);

    const result = await updateFinancialAccount({
      workspaceId,
      financialAccountId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para editar contas financeiras.",
    });

    expect(updateActiveFinancialAccountRecordMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN"] as const)("permite edição para Role %s", async (role) => {
    mockMembership(role);

    updateActiveFinancialAccountRecordMock.mockResolvedValue(financialAccount());

    const result = await updateFinancialAccount({
      workspaceId,
      financialAccountId,
      data: {
        name: "  Nubank Principal  ",
        type: "CHECKING",
      },
    });

    expect(result).toEqual({
      success: true,
    });

    expect(updateActiveFinancialAccountRecordMock).toHaveBeenCalledWith({
      workspaceId,
      financialAccountId,
      financialAccount: {
        name: "Nubank Principal",
        type: "CHECKING",
      },
    });
  });

  it("retorna não encontrada quando a conta não pode ser atualizada", async () => {
    mockMembership("OWNER");

    updateActiveFinancialAccountRecordMock.mockResolvedValue(null);

    const result = await updateFinancialAccount({
      workspaceId,
      financialAccountId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Conta financeira não encontrada.",
    });
  });

  it("retorna erro seguro quando a persistência falha", async () => {
    mockMembership("OWNER");

    updateActiveFinancialAccountRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await updateFinancialAccount({
      workspaceId,
      financialAccountId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível atualizar a conta financeira. Tente novamente.",
    });
  });
});

function validData() {
  return {
    name: "Nubank Principal",
    type: "DIGITAL" as const,
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
    archivedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
