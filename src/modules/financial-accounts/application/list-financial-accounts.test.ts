import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/financial-account-repository", () => ({
  listActiveFinancialAccountsByWorkspace: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { listActiveFinancialAccountsByWorkspace } from "../infrastructure/financial-account-repository";
import { listFinancialAccounts } from "./list-financial-accounts";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const listActiveFinancialAccountsByWorkspaceMock = vi.mocked(
  listActiveFinancialAccountsByWorkspace,
);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

describe("listFinancialAccounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await listFinancialAccounts(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await listFinancialAccounts(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(listActiveFinancialAccountsByWorkspaceMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)(
    "permite leitura para Role %s",
    async (role) => {
      mockCurrentUser();

      findWorkspaceMembershipMock.mockResolvedValue({
        workspaceId,
        userId: "user-1",
        role,
      });

      listActiveFinancialAccountsByWorkspaceMock.mockResolvedValue([]);

      const result = await listFinancialAccounts(workspaceId);

      expect(result).toEqual({
        success: true,
        financialAccounts: [],
      });
    },
  );

  it("retorna as contas ativas do Workspace", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    listActiveFinancialAccountsByWorkspaceMock.mockResolvedValue([
      {
        id: "account-1",
        workspaceId,
        name: "Nubank",
        type: "DIGITAL",
        initialBalance: "1500.2500",
        currency: "BRL",
        archivedAt: null,
        createdAt: new Date("2026-07-28T12:00:00Z"),
        updatedAt: new Date("2026-07-28T12:00:00Z"),
      },
    ]);

    const result = await listFinancialAccounts(workspaceId);

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso.");
    }

    expect(result.financialAccounts).toHaveLength(1);
    expect(result.financialAccounts[0]?.name).toBe("Nubank");
  });

  it("retorna erro seguro quando a consulta falha", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    listActiveFinancialAccountsByWorkspaceMock.mockRejectedValue(new Error("Database error"));

    const result = await listFinancialAccounts(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar as contas financeiras. Tente novamente.",
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
