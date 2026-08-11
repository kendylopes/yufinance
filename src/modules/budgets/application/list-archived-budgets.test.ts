import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/budget-repository", () => ({
  listArchivedBudgetsByWorkspace: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { listArchivedBudgetsByWorkspace } from "../infrastructure/budget-repository";
import { listArchivedBudgets } from "./list-archived-budgets";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const listArchivedBudgetsByWorkspaceMock = vi.mocked(listArchivedBudgetsByWorkspace);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const budgetId = "660e8400-e29b-41d4-a716-446655440000";

const categoryId = "770e8400-e29b-41d4-a716-446655440000";

describe("listArchivedBudgets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await listArchivedBudgets(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();

    expect(listArchivedBudgetsByWorkspaceMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await listArchivedBudgets(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(listArchivedBudgetsByWorkspaceMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)(
    "permite leitura para Role %s",
    async (role) => {
      mockMembership(role);

      listArchivedBudgetsByWorkspaceMock.mockResolvedValue([]);

      const result = await listArchivedBudgets(workspaceId);

      expect(result).toEqual({
        success: true,
        budgets: [],
      });
    },
  );

  it("consulta apenas os orçamentos arquivados do Workspace autorizado", async () => {
    mockMembership("OWNER");

    listArchivedBudgetsByWorkspaceMock.mockResolvedValue([]);

    await listArchivedBudgets(workspaceId);

    expect(listArchivedBudgetsByWorkspaceMock).toHaveBeenCalledWith(workspaceId);
  });

  it("retorna os orçamentos arquivados encontrados", async () => {
    mockMembership("OWNER");

    const archivedBudget = createArchivedBudget();

    listArchivedBudgetsByWorkspaceMock.mockResolvedValue([archivedBudget]);

    const result = await listArchivedBudgets(workspaceId);

    expect(result).toEqual({
      success: true,
      budgets: [archivedBudget],
    });
  });

  it("retorna erro seguro quando a consulta falha", async () => {
    mockMembership("OWNER");

    listArchivedBudgetsByWorkspaceMock.mockRejectedValue(new Error("Database error"));

    const result = await listArchivedBudgets(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar os orçamentos arquivados. Tente novamente.",
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

function createArchivedBudget() {
  return {
    id: budgetId,
    workspaceId,
    categoryId,
    categoryName: "Alimentação",
    month: 8,
    year: 2026,
    plannedAmount: "1200.0000",
    archivedAt: new Date("2026-08-08T12:00:00.000Z"),
    createdAt: new Date("2026-08-01T12:00:00.000Z"),
    updatedAt: new Date("2026-08-08T12:00:00.000Z"),
  };
}
