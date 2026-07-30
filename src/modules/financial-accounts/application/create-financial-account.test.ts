import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../infrastructure/financial-account-repository", () => ({
  getWorkspaceForFinancialAccountCreation: vi.fn(),
  createFinancialAccountRecord: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import {
  createFinancialAccountRecord,
  getWorkspaceForFinancialAccountCreation,
} from "../infrastructure/financial-account-repository";
import { createFinancialAccount } from "./create-financial-account";

const getCurrentUserMock = vi.mocked(getCurrentUser);
const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const getWorkspaceForFinancialAccountCreationMock = vi.mocked(
  getWorkspaceForFinancialAccountCreation,
);

const createFinancialAccountRecordMock = vi.mocked(createFinancialAccountRecord);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

describe("createFinancialAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita dados inválidos", async () => {
    const result = await createFinancialAccount({
      workspaceId,
      data: {
        name: "N",
        type: "DIGITAL",
        initialBalance: "0",
      },
    });

    expect(result).toEqual({
      success: false,
      message: "Os dados informados não são válidos.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await createFinancialAccount({
      workspaceId,
      data: validData(),
    });

    expect(result.success).toBe(false);

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
  });

  it("rejeita usuário sem Membership no Workspace", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await createFinancialAccount({
      workspaceId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(getWorkspaceForFinancialAccountCreationMock).not.toHaveBeenCalled();
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede criação para Role %s", async (role) => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue({
      workspaceId,
      userId: "user-1",
      role,
    });

    const result = await createFinancialAccount({
      workspaceId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para criar contas financeiras.",
    });

    expect(getWorkspaceForFinancialAccountCreationMock).not.toHaveBeenCalled();
  });

  it("rejeita Workspace inexistente", async () => {
    mockAuthorizedUser("OWNER");

    getWorkspaceForFinancialAccountCreationMock.mockResolvedValue(null);

    const result = await createFinancialAccount({
      workspaceId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "O espaço financeiro informado não foi encontrado.",
    });

    expect(createFinancialAccountRecordMock).not.toHaveBeenCalled();
  });

  it.each(["OWNER", "ADMIN"] as const)("permite criação para Role %s", async (role) => {
    mockAuthorizedUser(role);

    getWorkspaceForFinancialAccountCreationMock.mockResolvedValue({
      id: workspaceId,
      currency: "BRL",
    });

    createFinancialAccountRecordMock.mockResolvedValue({
      id: "financial-account-1",
    });

    const result = await createFinancialAccount({
      workspaceId,
      data: validData(),
    });

    expect(result).toEqual({
      success: true,
      financialAccountId: "financial-account-1",
    });
  });

  it("utiliza a moeda do Workspace na criação", async () => {
    mockAuthorizedUser("OWNER");

    getWorkspaceForFinancialAccountCreationMock.mockResolvedValue({
      id: workspaceId,
      currency: "BRL",
    });

    createFinancialAccountRecordMock.mockResolvedValue({
      id: "financial-account-1",
    });

    await createFinancialAccount({
      workspaceId,
      data: {
        name: "  Nubank  ",
        type: "DIGITAL",
        initialBalance: "1500,25",
      },
    });

    expect(createFinancialAccountRecordMock).toHaveBeenCalledWith({
      workspaceId,
      currency: "BRL",
      financialAccount: {
        name: "Nubank",
        type: "DIGITAL",
        initialBalance: "1500.25",
      },
    });
  });

  it("retorna erro seguro quando a persistência falha", async () => {
    mockAuthorizedUser("OWNER");

    getWorkspaceForFinancialAccountCreationMock.mockResolvedValue({
      id: workspaceId,
      currency: "BRL",
    });

    createFinancialAccountRecordMock.mockRejectedValue(new Error("Database error"));

    const result = await createFinancialAccount({
      workspaceId,
      data: validData(),
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível criar a conta financeira. Tente novamente.",
    });
  });
});

function validData() {
  return {
    name: "Nubank",
    type: "DIGITAL" as const,
    initialBalance: "1500.25",
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

function mockAuthorizedUser(role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER") {
  mockCurrentUser();

  findWorkspaceMembershipMock.mockResolvedValue({
    workspaceId,
    userId: "user-1",
    role,
  });
}
