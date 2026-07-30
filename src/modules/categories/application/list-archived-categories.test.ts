import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/category-repository", () => ({
  findArchivedCategoriesByWorkspaceId: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { findArchivedCategoriesByWorkspaceId } from "../infrastructure/category-repository";
import { listArchivedCategories } from "./list-archived-categories";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const findArchivedCategoriesByWorkspaceIdMock = vi.mocked(findArchivedCategoriesByWorkspaceId);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

describe("listArchivedCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await listArchivedCategories(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();

    expect(findArchivedCategoriesByWorkspaceIdMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await listArchivedCategories(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(findArchivedCategoriesByWorkspaceIdMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)(
    "permite leitura de categorias arquivadas para Role %s",
    async (role) => {
      mockMembership(role);

      findArchivedCategoriesByWorkspaceIdMock.mockResolvedValue([]);

      const result = await listArchivedCategories(workspaceId);

      expect(result).toEqual({
        success: true,
        categories: [],
      });

      expect(findArchivedCategoriesByWorkspaceIdMock).toHaveBeenCalledWith(workspaceId);
    },
  );

  it("retorna as categorias arquivadas do Workspace", async () => {
    mockMembership("OWNER");

    const archivedAt = new Date("2026-07-30T18:00:00.000Z");

    findArchivedCategoriesByWorkspaceIdMock.mockResolvedValue([
      {
        id: "category-1",
        workspaceId,
        name: "Alimentação",
        type: "EXPENSE",
        archivedAt,
        createdAt: new Date("2026-07-30T15:00:00.000Z"),
        updatedAt: archivedAt,
      },
    ]);

    const result = await listArchivedCategories(workspaceId);

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso.");
    }

    expect(result.categories).toHaveLength(1);

    expect(result.categories[0]).toEqual({
      id: "category-1",
      workspaceId,
      name: "Alimentação",
      type: "EXPENSE",
      archivedAt,
      createdAt: new Date("2026-07-30T15:00:00.000Z"),
      updatedAt: archivedAt,
    });

    expect(findArchivedCategoriesByWorkspaceIdMock).toHaveBeenCalledWith(workspaceId);
  });

  it("retorna erro seguro quando a consulta falha", async () => {
    mockMembership("OWNER");

    findArchivedCategoriesByWorkspaceIdMock.mockRejectedValue(new Error("Database error"));

    const result = await listArchivedCategories(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar as categorias arquivadas. Tente novamente.",
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
