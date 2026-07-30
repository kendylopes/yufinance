import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/category-repository", () => ({
  findActiveCategoriesByWorkspaceId: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { findActiveCategoriesByWorkspaceId } from "../infrastructure/category-repository";
import { listCategories } from "./list-categories";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const findActiveCategoriesByWorkspaceIdMock = vi.mocked(findActiveCategoriesByWorkspaceId);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

describe("listCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await listCategories(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
    expect(findActiveCategoriesByWorkspaceIdMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await listCategories(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(findActiveCategoriesByWorkspaceIdMock).not.toHaveBeenCalled();
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

      findActiveCategoriesByWorkspaceIdMock.mockResolvedValue([]);

      const result = await listCategories(workspaceId);

      expect(result).toEqual({
        success: true,
        categories: [],
      });

      expect(findActiveCategoriesByWorkspaceIdMock).toHaveBeenCalledWith(workspaceId);
    },
  );

  it("retorna as categorias ativas do Workspace", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    findActiveCategoriesByWorkspaceIdMock.mockResolvedValue([
      {
        id: "660e8400-e29b-41d4-a716-446655440000",
        workspaceId,
        name: "Alimentação",
        type: "EXPENSE",
        archivedAt: null,
        createdAt: new Date("2026-07-30T12:00:00Z"),
        updatedAt: new Date("2026-07-30T12:00:00Z"),
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440000",
        workspaceId,
        name: "Salário",
        type: "INCOME",
        archivedAt: null,
        createdAt: new Date("2026-07-30T12:00:00Z"),
        updatedAt: new Date("2026-07-30T12:00:00Z"),
      },
    ]);

    const result = await listCategories(workspaceId);

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso.");
    }

    expect(result.categories).toHaveLength(2);
    expect(result.categories[0]?.name).toBe("Alimentação");
    expect(result.categories[1]?.name).toBe("Salário");
  });

  it("retorna erro seguro quando a consulta falha", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role: "OWNER",
    });

    findActiveCategoriesByWorkspaceIdMock.mockRejectedValue(new Error("Database error"));

    const result = await listCategories(workspaceId);

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar as categorias. Tente novamente.",
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
