import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/financial-account-repository", () => ({
  listArchivedFinancialAccountsByWorkspace: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { listArchivedFinancialAccountsByWorkspace } from "../infrastructure/financial-account-repository";
import { listArchivedFinancialAccounts } from "./list-archived-financial-accounts";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const listArchivedFinancialAccountsByWorkspaceMock = vi.mocked(
  listArchivedFinancialAccountsByWorkspace,
);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

describe("listArchivedFinancialAccounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await listArchivedFinancialAccounts(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();

    expect(listArchivedFinancialAccountsByWorkspaceMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await listArchivedFinancialAccounts(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(listArchivedFinancialAccountsByWorkspaceMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)(
    "permite leitura de contas arquivadas para Role %s",
    async (role) => {
      mockMembership(role);

      listArchivedFinancialAccountsByWorkspaceMock.mockResolvedValue([]);

      const result = await listArchivedFinancialAccounts(workspaceId);

      expect(result).toEqual({
        success: true,
        financialAccounts: [],
      });

      expect(listArchivedFinancialAccountsByWorkspaceMock).toHaveBeenCalledWith(workspaceId);
    },
  );

  it("retorna as contas arquivadas do Workspace", async () => {
    mockMembership("OWNER");

    const archivedAt = new Date("2026-07-28T20:00:00.000Z");

    listArchivedFinancialAccountsByWorkspaceMock.mockResolvedValue([
      {
        id: "financial-account-1",
        workspaceId,
        name: "Nubank Principal",
        type: "CHECKING",
        initialBalance: "1500.2500",
        currency: "BRL",
        archivedAt,
        createdAt: new Date("2026-07-28T15:00:00.000Z"),
        updatedAt: archivedAt,
      },
    ]);

    const result = await listArchivedFinancialAccounts(workspaceId);

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso.");
    }

    expect(result.financialAccounts).toHaveLength(1);

    expect(result.financialAccounts[0]).toEqual({
      id: "financial-account-1",
      workspaceId,
      name: "Nubank Principal",
      type: "CHECKING",
      initialBalance: "1500.2500",
      currency: "BRL",
      archivedAt,
      createdAt: new Date("2026-07-28T15:00:00.000Z"),
      updatedAt: archivedAt,
    });

    expect(listArchivedFinancialAccountsByWorkspaceMock).toHaveBeenCalledWith(workspaceId);
  });

  it("retorna erro seguro quando a consulta falha", async () => {
    mockMembership("OWNER");

    listArchivedFinancialAccountsByWorkspaceMock.mockRejectedValue(new Error("Database error"));

    const result = await listArchivedFinancialAccounts(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar as contas arquivadas. Tente novamente.",
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
