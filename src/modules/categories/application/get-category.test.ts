import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/category-repository", () => ({
  findActiveCategoryById: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { findActiveCategoryById } from "../infrastructure/category-repository";
import { getCategory } from "./get-category";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);
const findActiveCategoryByIdMock = vi.mocked(findActiveCategoryById);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const categoryId = "660e8400-e29b-41d4-a716-446655440000";

describe("getCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await getCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
    expect(findActiveCategoryByIdMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await getCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(findActiveCategoryByIdMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)(
    "permite leitura para Role %s",
    async (role) => {
      mockMembership(role);
      findActiveCategoryByIdMock.mockResolvedValue(category());

      const result = await getCategory({
        workspaceId,
        categoryId,
      });

      expect(result.success).toBe(true);
    },
  );

  it("busca a categoria dentro do Workspace autorizado", async () => {
    mockMembership("OWNER");
    findActiveCategoryByIdMock.mockResolvedValue(category());

    await getCategory({
      workspaceId,
      categoryId,
    });

    expect(findActiveCategoryByIdMock).toHaveBeenCalledWith(categoryId, workspaceId);
  });

  it("retorna não encontrada quando a categoria não existe no Workspace", async () => {
    mockMembership("OWNER");
    findActiveCategoryByIdMock.mockResolvedValue(null);

    const result = await getCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Categoria não encontrada.",
    });
  });

  it("retorna a categoria encontrada", async () => {
    mockMembership("OWNER");
    findActiveCategoryByIdMock.mockResolvedValue(category());

    const result = await getCategory({
      workspaceId,
      categoryId,
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso.");
    }

    expect(result.category.name).toBe("Alimentação");
    expect(result.category.type).toBe("EXPENSE");
  });

  it("retorna erro seguro quando a consulta falha", async () => {
    mockMembership("OWNER");

    findActiveCategoryByIdMock.mockRejectedValue(new Error("Database error"));

    const result = await getCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar a categoria. Tente novamente.",
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

function category() {
  return {
    id: categoryId,
    workspaceId,
    name: "Alimentação",
    type: "EXPENSE" as const,
    archivedAt: null,
    createdAt: new Date("2026-07-30T12:00:00Z"),
    updatedAt: new Date("2026-07-30T12:00:00Z"),
  };
}
