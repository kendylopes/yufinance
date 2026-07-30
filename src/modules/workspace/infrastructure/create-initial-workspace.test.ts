import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { persistInitialWorkspace } from "./create-initial-workspace";
import {
  createInitialWorkspaceRecords,
  findWorkspaceMembershipByUserId,
} from "./workspace-repository";

vi.mock("./workspace-repository", () => ({
  findWorkspaceMembershipByUserId: vi.fn(),
  createInitialWorkspaceRecords: vi.fn(),
}));

const findWorkspaceMembershipByUserIdMock = vi.mocked(findWorkspaceMembershipByUserId);

const createInitialWorkspaceRecordsMock = vi.mocked(createInitialWorkspaceRecords);

describe("persistInitialWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("impede a criação quando o usuário já possui Workspace", async () => {
    findWorkspaceMembershipByUserIdMock.mockResolvedValue({
      workspaceId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const result = await persistInitialWorkspace({
      userId: "user-123",
      workspace: {
        name: "Minhas Finanças",
        type: "PERSONAL",
      },
    });

    expect(result).toEqual({
      success: false,
      reason: "WORKSPACE_ALREADY_EXISTS",
    });

    expect(createInitialWorkspaceRecordsMock).not.toHaveBeenCalled();
  });

  it("cria os registros do Workspace inicial quando não existe Membership", async () => {
    findWorkspaceMembershipByUserIdMock.mockResolvedValue(null);

    createInitialWorkspaceRecordsMock.mockResolvedValue(undefined);

    const result = await persistInitialWorkspace({
      userId: "user-123",
      workspace: {
        name: "Minhas Finanças",
        type: "PERSONAL",
      },
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso na criação.");
    }

    expect(result.workspaceId).toEqual(expect.any(String));

    expect(createInitialWorkspaceRecordsMock).toHaveBeenCalledOnce();

    expect(createInitialWorkspaceRecordsMock).toHaveBeenCalledWith({
      workspaceId: result.workspaceId,
      userId: "user-123",
      workspace: {
        name: "Minhas Finanças",
        type: "PERSONAL",
      },
    });
  });

  it("gera um UUID válido para o Workspace", async () => {
    findWorkspaceMembershipByUserIdMock.mockResolvedValue(null);

    createInitialWorkspaceRecordsMock.mockResolvedValue(undefined);

    const result = await persistInitialWorkspace({
      userId: "user-123",
      workspace: {
        name: "Família",
        type: "FAMILY",
      },
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso na criação.");
    }

    expect(result.workspaceId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("propaga a falha quando a criação dos registros falha", async () => {
    findWorkspaceMembershipByUserIdMock.mockResolvedValue(null);

    createInitialWorkspaceRecordsMock.mockRejectedValue(new Error("Database unavailable"));

    await expect(
      persistInitialWorkspace({
        userId: "user-123",
        workspace: {
          name: "Minhas Finanças",
          type: "PERSONAL",
        },
      }),
    ).rejects.toThrow("Database unavailable");
  });
});
