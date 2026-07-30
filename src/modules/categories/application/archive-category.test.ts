import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/category-repository", () => ({
  archiveActiveCategoryRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { archiveActiveCategoryRecord } from "../infrastructure/category-repository";
import { archiveCategory } from "./archive-category";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const archiveActiveCategoryRecordMock = vi.mocked(archiveActiveCategoryRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const categoryId = "660e8400-e29b-41d4-a716-446655440000";

describe("archiveCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await archiveCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
    expect(archiveActiveCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await archiveCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(archiveActiveCategoryRecordMock).not.toHaveBeenCalled();
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede arquivamento para Role %s", async (role) => {
    mockMembership(role);

    const result = await archiveCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para arquivar categorias.",
    });

    expect(archiveActiveCategoryRecordMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN"] as const)("permite arquivamento para Role %s", async (role) => {
    mockMembership(role);

    archiveActiveCategoryRecordMock.mockResolvedValue(archivedCategory());

    const result = await archiveCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: true,
    });

    expect(archiveActiveCategoryRecordMock).toHaveBeenCalledWith({
      workspaceId,
      categoryId,
    });
  });

  it("retorna não encontrada quando a categoria não pode ser arquivada", async () => {
    mockMembership("OWNER");

    archiveActiveCategoryRecordMock.mockResolvedValue(null);

    const result = await archiveCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Categoria não encontrada.",
    });
  });

  it("retorna erro seguro quando a persistência falha", async () => {
    mockMembership("OWNER");

    archiveActiveCategoryRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await archiveCategory({
      workspaceId,
      categoryId,
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível arquivar a categoria. Tente novamente.",
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

function archivedCategory() {
  return {
    id: categoryId,
    workspaceId,
    name: "Alimentação",
    type: "EXPENSE" as const,
    archivedAt: new Date("2026-07-30T14:00:00Z"),
    createdAt: new Date("2026-07-30T12:00:00Z"),
    updatedAt: new Date("2026-07-30T14:00:00Z"),
  };
}
