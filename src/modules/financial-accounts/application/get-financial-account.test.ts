import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/financial-account-repository", () => ({
  findActiveFinancialAccountById: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { findActiveFinancialAccountById } from "../infrastructure/financial-account-repository";
import { getFinancialAccount } from "./get-financial-account";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const findActiveFinancialAccountByIdMock = vi.mocked(findActiveFinancialAccountById);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const financialAccountId = "660e8400-e29b-41d4-a716-446655440000";

describe("getFinancialAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await getFinancialAccount({
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

    const result = await getFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(findActiveFinancialAccountByIdMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)(
    "permite leitura para Role %s",
    async (role) => {
      mockMembership(role);

      findActiveFinancialAccountByIdMock.mockResolvedValue(financialAccount());

      const result = await getFinancialAccount({
        workspaceId,
        financialAccountId,
      });

      expect(result.success).toBe(true);
    },
  );

  it("busca a conta dentro do Workspace autorizado", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockResolvedValue(financialAccount());

    await getFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(findActiveFinancialAccountByIdMock).toHaveBeenCalledWith(
      financialAccountId,
      workspaceId,
    );
  });

  it("retorna não encontrada quando a conta não existe no Workspace", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockResolvedValue(null);

    const result = await getFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Conta financeira não encontrada.",
    });
  });

  it("retorna a conta encontrada", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockResolvedValue(financialAccount());

    const result = await getFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso.");
    }

    expect(result.financialAccount.name).toBe("Nubank");
    expect(result.financialAccount.type).toBe("DIGITAL");
  });

  it("retorna erro seguro quando a consulta falha", async () => {
    mockMembership("OWNER");

    findActiveFinancialAccountByIdMock.mockRejectedValue(new Error("Database error"));

    const result = await getFinancialAccount({
      workspaceId,
      financialAccountId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar a conta financeira. Tente novamente.",
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
    name: "Nubank",
    type: "DIGITAL" as const,
    initialBalance: "1500.2500",
    currency: "BRL",
    archivedAt: null,
    createdAt: new Date("2026-07-28T15:11:43Z"),
    updatedAt: new Date("2026-07-28T15:11:43Z"),
  };
}
