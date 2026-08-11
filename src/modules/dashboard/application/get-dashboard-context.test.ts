import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { getDashboardContext } from "./get-dashboard-context";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const referenceDate = new Date("2026-08-15T12:00:00.000Z");

describe("getDashboardContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro para usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await getDashboardContext({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });

    expect(findWorkspaceMembershipMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await getDashboardContext({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(findWorkspaceMembershipMock).toHaveBeenCalledWith("user-1", workspaceId);
  });

  it("usa CURRENT_MONTH como período padrão", async () => {
    mockMembership();

    const result = await getDashboardContext({
      workspaceId,
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      context: {
        workspaceId,
        userId: "user-1",
        startDate: new Date(2026, 7, 1),
        endDate: referenceDate,
      },
    });
  });

  it("usa o período explicitamente informado", async () => {
    mockMembership();

    const result = await getDashboardContext({
      workspaceId,
      period: "LAST_7_DAYS",
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      context: {
        workspaceId,
        userId: "user-1",
        startDate: new Date(2026, 7, 9, 0, 0, 0, 0),
        endDate: referenceDate,
      },
    });
  });

  it("usa o período padrão específico do caso de uso", async () => {
    mockMembership();

    const result = await getDashboardContext({
      workspaceId,
      defaultPeriod: "CURRENT_YEAR",
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      context: {
        workspaceId,
        userId: "user-1",
        startDate: new Date(2026, 0, 1),
        endDate: referenceDate,
      },
    });
  });

  it("prioriza period sobre defaultPeriod", async () => {
    mockMembership();

    const result = await getDashboardContext({
      workspaceId,
      period: "TODAY",
      defaultPeriod: "CURRENT_YEAR",
      referenceDate,
    });

    expect(result).toEqual({
      success: true,
      context: {
        workspaceId,
        userId: "user-1",
        startDate: new Date(2026, 7, 15, 0, 0, 0, 0),
        endDate: referenceDate,
      },
    });
  });

  it("não altera a data de referência recebida", async () => {
    mockMembership();

    const originalTimestamp = referenceDate.getTime();

    await getDashboardContext({
      workspaceId,
      period: "LAST_30_DAYS",
      referenceDate,
    });

    expect(referenceDate.getTime()).toBe(originalTimestamp);
  });
});

function mockCurrentUser() {
  getCurrentUserMock.mockResolvedValue({
    id: "user-1",
    name: "Kennedy",
    email: "kennedy@example.com",
    emailVerified: false,
    image: null,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  });
}

function mockMembership() {
  mockCurrentUser();

  findWorkspaceMembershipMock.mockResolvedValue({
    workspaceId,
    userId: "user-1",
    role: "OWNER",
  });
}
