import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/category-repository", () => ({
  restoreArchivedCategoryRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { restoreArchivedCategoryRecord } from "../infrastructure/category-repository";
import { restoreCategory } from "./restore-category";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const restoreArchivedCategoryRecordMock = vi.mocked(restoreArchivedCategoryRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const categoryId = "660e8400-e29b-41d4-a716-446655440000";

describe("restoreCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await restoreCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
    expect(restoreArchivedCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await restoreCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(restoreArchivedCategoryRecordMock).not.toHaveBeenCalled();
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede restauração para Role %s", async (role) => {
    mockMembership(role);

    const result = await restoreCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para restaurar categorias.",
    });

    expect(restoreArchivedCategoryRecordMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN"] as const)("permite restauração para Role %s", async (role) => {
    mockMembership(role);

    restoreArchivedCategoryRecordMock.mockResolvedValue(activeCategory());

    const result = await restoreCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: true,
    });

    expect(restoreArchivedCategoryRecordMock).toHaveBeenCalledWith({
      workspaceId,
      categoryId,
    });
  });

  it("retorna não encontrada quando a categoria arquivada não pode ser restaurada", async () => {
    mockMembership("OWNER");

    restoreArchivedCategoryRecordMock.mockResolvedValue(null);

    const result = await restoreCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Categoria arquivada não encontrada.",
    });
  });

  it("retorna erro seguro quando a persistência falha", async () => {
    mockMembership("OWNER");

    restoreArchivedCategoryRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await restoreCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível restaurar a categoria. Tente novamente.",
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

function activeCategory() {
  return {
    id: categoryId,
    workspaceId,
    name: "Alimentação",
    type: "EXPENSE" as const,
    archivedAt: null,
    createdAt: new Date("2026-07-30T12:00:00Z"),
    updatedAt: new Date("2026-07-30T15:00:00Z"),
  };
}
