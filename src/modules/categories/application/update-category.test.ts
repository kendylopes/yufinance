import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/category-repository", () => ({
  updateActiveCategoryRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { updateActiveCategoryRecord } from "../infrastructure/category-repository";
import { updateCategory } from "./update-category";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const updateActiveCategoryRecordMock = vi.mocked(updateActiveCategoryRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const categoryId = "660e8400-e29b-41d4-a716-446655440000";

describe("updateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita dados inválidos", async () => {
    const result = await updateCategory({
      workspaceId,
      categoryId,
      data: {
        name: "A",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Os dados informados não são válidos.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
    expect(updateActiveCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await updateCategory({
      workspaceId,
      categoryId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
    expect(updateActiveCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();
    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await updateCategory({
      workspaceId,
      categoryId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(updateActiveCategoryRecordMock).not.toHaveBeenCalled();
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede edição para Role %s", async (role) => {
    mockMembership(role);

    const result = await updateCategory({
      workspaceId,
      categoryId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para editar categorias.",
    });

    expect(updateActiveCategoryRecordMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN"] as const)("permite edição para Role %s", async (role) => {
    mockMembership(role);
    updateActiveCategoryRecordMock.mockResolvedValue(category());

    const result = await updateCategory({
      workspaceId,
      categoryId,
      data: {
        name: "  Alimentação e mercado  ",
      },
    });

    expect(result).toEqual({
      success: true,
    });

    expect(updateActiveCategoryRecordMock).toHaveBeenCalledWith({
      workspaceId,
      categoryId,
      category: {
        name: "Alimentação e mercado",
      },
    });
  });

  it("não permite alterar o tipo da categoria", async () => {
    mockMembership("OWNER");
    updateActiveCategoryRecordMock.mockResolvedValue(category());

    const result = await updateCategory({
      workspaceId,
      categoryId,
      data: {
        name: "Alimentação",
        type: "INCOME",
      } as never,
    });

    expect(result).toEqual({
      success: true,
    });

    expect(updateActiveCategoryRecordMock).toHaveBeenCalledWith({
      workspaceId,
      categoryId,
      category: {
        name: "Alimentação",
      },
    });
  });

  it("retorna não encontrada quando a categoria não pode ser atualizada", async () => {
    mockMembership("OWNER");
    updateActiveCategoryRecordMock.mockResolvedValue(null);

    const result = await updateCategory({
      workspaceId,
      categoryId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Categoria não encontrada.",
    });
  });

  it("retorna erro seguro quando a persistência falha", async () => {
    mockMembership("OWNER");

    updateActiveCategoryRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await updateCategory({
      workspaceId,
      categoryId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível atualizar a categoria. Tente novamente.",
    });
  });
});

function validData() {
  return {
    name: "Alimentação e mercado",
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

function category() {
  return {
    id: categoryId,
    workspaceId,
    name: "Alimentação e mercado",
    type: "EXPENSE" as const,
    archivedAt: null,
    createdAt: new Date("2026-07-30T12:00:00Z"),
    updatedAt: new Date("2026-07-30T13:00:00Z"),
  };
}
