import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";

import { persistInitialWorkspace } from "../infrastructure/create-initial-workspace";
import { createInitialWorkspace } from "./create-initial-workspace";

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("../infrastructure/create-initial-workspace", () => ({
  persistInitialWorkspace: vi.fn(),
}));

const getCurrentUserMock = vi.mocked(getCurrentUser);
const persistInitialWorkspaceMock = vi.mocked(persistInitialWorkspace);

describe("createInitialWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejeita dados inválidos antes de consultar o usuário atual", async () => {
    const result = await createInitialWorkspace({
      name: "A",
      type: "PERSONAL",
    });

    expect(result).toEqual({
      success: false,
      message: "Os dados informados não são válidos.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
    expect(persistInitialWorkspaceMock).not.toHaveBeenCalled();
  });

  it("rejeita a operação quando não existe usuário autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await createInitialWorkspace({
      name: "Minhas Finanças",
      type: "PERSONAL",
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(persistInitialWorkspaceMock).not.toHaveBeenCalled();
  });

  it("impede a criação quando o onboarding inicial já foi realizado", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: "user-123",
      name: "Kennedy",
      email: "kennedy@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    persistInitialWorkspaceMock.mockResolvedValue({
      success: false,
      reason: "WORKSPACE_ALREADY_EXISTS",
    });

    const result = await createInitialWorkspace({
      name: "Minhas Finanças",
      type: "PERSONAL",
    });

    expect(result).toEqual({
      success: false,
      message: "Seu espaço financeiro inicial já foi configurado.",
    });
  });

  it("cria o Workspace inicial para o usuário autenticado", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: "user-123",
      name: "Kennedy",
      email: "kennedy@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    persistInitialWorkspaceMock.mockResolvedValue({
      success: true,
      workspaceId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const result = await createInitialWorkspace({
      name: "  Minhas Finanças  ",
    });

    expect(persistInitialWorkspaceMock).toHaveBeenCalledWith({
      userId: "user-123",
      workspace: {
        name: "Minhas Finanças",
        type: "PERSONAL",
      },
    });

    expect(result).toEqual({
      success: true,
      workspaceId: "550e8400-e29b-41d4-a716-446655440000",
    });
  });

  it("retorna mensagem segura quando ocorre um erro inesperado", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: "user-123",
      name: "Kennedy",
      email: "kennedy@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    persistInitialWorkspaceMock.mockRejectedValue(new Error("Database unavailable"));

    const result = await createInitialWorkspace({
      name: "Minhas Finanças",
      type: "FAMILY",
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível configurar seu espaço financeiro. Tente novamente.",
    });
  });
});
