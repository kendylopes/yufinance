import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { getCurrentUserMock, findWorkspaceMembershipMock, createCategoryRecordMock } = vi.hoisted(
  () => ({
    getCurrentUserMock: vi.fn(),
    findWorkspaceMembershipMock: vi.fn(),
    createCategoryRecordMock: vi.fn(),
  }),
);

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: getCurrentUserMock,
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: findWorkspaceMembershipMock,
}));

vi.mock("../infrastructure/category-repository", () => ({
  createCategoryRecord: createCategoryRecordMock,
}));

import { createCategory } from "./create-category";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const user = {
  id: "user-1",
  name: "Kennedy",
  email: "kennedy@example.com",
  emailVerified: true,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createdCategory = {
  id: "660e8400-e29b-41d4-a716-446655440000",
  workspaceId,
  name: "Alimentação",
  type: "EXPENSE" as const,
  archivedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("createCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getCurrentUserMock.mockResolvedValue(user);

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: user.id,
      role: "OWNER",
    });

    createCategoryRecordMock.mockResolvedValue(createdCategory);
  });

  it("returns validation error when input data is invalid", async () => {
    const result = await createCategory({
      workspaceId,
      data: {
        name: "A",
        type: "EXPENSE",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Os dados informados não são válidos.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
    expect(createCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("returns authentication error when there is no current user", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await createCategory({
      workspaceId,
      data: {
        name: "Alimentação",
        type: "EXPENSE",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
    expect(createCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("returns access error when user has no workspace membership", async () => {
    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await createCategory({
      workspaceId,
      data: {
        name: "Alimentação",
        type: "EXPENSE",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(findWorkspaceMembershipMock).toHaveBeenCalledWith(user.id, workspaceId);
    expect(createCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("returns permission error for MEMBER", async () => {
    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: user.id,
      role: "MEMBER",
    });

    const result = await createCategory({
      workspaceId,
      data: {
        name: "Alimentação",
        type: "EXPENSE",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para criar categorias.",
    });

    expect(createCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("returns permission error for VIEWER", async () => {
    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: user.id,
      role: "VIEWER",
    });

    const result = await createCategory({
      workspaceId,
      data: {
        name: "Alimentação",
        type: "EXPENSE",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para criar categorias.",
    });

    expect(createCategoryRecordMock).not.toHaveBeenCalled();
  });

  it("creates a category for OWNER", async () => {
    const result = await createCategory({
      workspaceId,
      data: {
        name: "Alimentação",
        type: "EXPENSE",
      },
    });

    expect(result).toEqual({
      success: true,
      categoryId: createdCategory.id,
    });

    expect(findWorkspaceMembershipMock).toHaveBeenCalledWith(user.id, workspaceId);
    expect(createCategoryRecordMock).toHaveBeenCalledWith({
      workspaceId,
      name: "Alimentação",
      type: "EXPENSE",
    });
  });

  it("creates a category for ADMIN", async () => {
    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: user.id,
      role: "ADMIN",
    });

    const result = await createCategory({
      workspaceId,
      data: {
        name: "Salário",
        type: "INCOME",
      },
    });

    expect(result).toEqual({
      success: true,
      categoryId: createdCategory.id,
    });

    expect(createCategoryRecordMock).toHaveBeenCalledWith({
      workspaceId,
      name: "Salário",
      type: "INCOME",
    });
  });

  it("passes the normalized name to the repository", async () => {
    await createCategory({
      workspaceId,
      data: {
        name: "  Alimentação  ",
        type: "EXPENSE",
      },
    });

    expect(createCategoryRecordMock).toHaveBeenCalledWith({
      workspaceId,
      name: "Alimentação",
      type: "EXPENSE",
    });
  });

  it("returns a generic error when repository creation fails", async () => {
    createCategoryRecordMock.mockRejectedValue(new Error("database unavailable"));

    const result = await createCategory({
      workspaceId,
      data: {
        name: "Alimentação",
        type: "EXPENSE",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível criar a categoria. Tente novamente.",
    });
  });
});
