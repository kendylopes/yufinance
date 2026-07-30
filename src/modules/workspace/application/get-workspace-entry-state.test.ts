import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";

import { findWorkspaceMembershipByUserId } from "../infrastructure/workspace-repository";
import { getWorkspaceEntryState } from "./get-workspace-entry-state";

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("../infrastructure/workspace-repository", () => ({
  findWorkspaceMembershipByUserId: vi.fn(),
}));

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipByUserIdMock = vi.mocked(findWorkspaceMembershipByUserId);

describe("getWorkspaceEntryState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna UNAUTHENTICATED quando não existe usuário autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await getWorkspaceEntryState();

    expect(result).toEqual({
      status: "UNAUTHENTICATED",
    });

    expect(findWorkspaceMembershipByUserIdMock).not.toHaveBeenCalled();
  });

  it("retorna ONBOARDING_REQUIRED quando o usuário não possui Workspace", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: "user-123",
      name: "Kennedy",
      email: "kennedy@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    findWorkspaceMembershipByUserIdMock.mockResolvedValue(null);

    const result = await getWorkspaceEntryState();

    expect(findWorkspaceMembershipByUserIdMock).toHaveBeenCalledWith("user-123");

    expect(result).toEqual({
      status: "ONBOARDING_REQUIRED",
      userId: "user-123",
    });
  });

  it("retorna READY quando o usuário possui Workspace", async () => {
    getCurrentUserMock.mockResolvedValue({
      id: "user-123",
      name: "Kennedy",
      email: "kennedy@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    findWorkspaceMembershipByUserIdMock.mockResolvedValue({
      workspaceId: "550e8400-e29b-41d4-a716-446655440000",
    });

    const result = await getWorkspaceEntryState();

    expect(result).toEqual({
      status: "READY",
      userId: "user-123",
      workspaceId: "550e8400-e29b-41d4-a716-446655440000",
    });
  });
});
