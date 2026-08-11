import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/modules/identity/application/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/workspace/infrastructure/workspace-repository", () => ({
  findWorkspaceMembership: vi.fn(),
}));

vi.mock("../domain/budget-permissions", () => ({
  canReadBudgets: vi.fn(),
}));

vi.mock("../infrastructure/budget-repository", () => ({
  listActiveBudgetProgressRecords: vi.fn(),
}));

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canReadBudgets } from "../domain/budget-permissions";
import { listActiveBudgetProgressRecords } from "../infrastructure/budget-repository";
import { listBudgets } from "./list-budgets";

const getCurrentUserMock = vi.mocked(getCurrentUser);

const findWorkspaceMembershipMock = vi.mocked(findWorkspaceMembership);

const canReadBudgetsMock = vi.mocked(canReadBudgets);

const listActiveBudgetProgressRecordsMock = vi.mocked(listActiveBudgetProgressRecords);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const categoryId = "660e8400-e29b-41d4-a716-446655440000";

describe("listBudgets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna erro para entrada inválida", async () => {
    const result = await listBudgets({
      workspaceId,
      month: 13,
      year: 2026,
    });

    expect(result).toEqual({
      success: false,
      message: "O mês deve estar entre 1 e 12.",
    });

    expect(getCurrentUserMock).not.toHaveBeenCalled();
  });

  it("retorna erro para usuário não autenticado", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    });
  });

  it("retorna erro para usuário sem Membership", async () => {
    mockCurrentUser();

    findWorkspaceMembershipMock.mockResolvedValue(null);

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    });

    expect(listActiveBudgetProgressRecordsMock).not.toHaveBeenCalled();
  });

  it("retorna erro para papel sem leitura", async () => {
    mockMembership();

    canReadBudgetsMock.mockReturnValue(false);

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Você não possui permissão para consultar orçamentos.",
    });

    expect(listActiveBudgetProgressRecordsMock).not.toHaveBeenCalled();
  });

  it("retorna lista vazia", async () => {
    mockAuthorizedUser();

    listActiveBudgetProgressRecordsMock.mockResolvedValue([]);

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: true,
      budgets: [],
    });
  });

  it("calcula orçamento dentro do limite", async () => {
    mockAuthorizedUser();

    listActiveBudgetProgressRecordsMock.mockResolvedValue([
      createRecord({
        plannedAmount: "1000.0000",
        spentAmount: "500.0000",
      }),
    ]);

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: true,
      budgets: [
        expect.objectContaining({
          plannedAmount: "1000.0000",
          spentAmount: "500.0000",
          remainingAmount: "500.0000",
          percentage: 50,
          status: "ON_TRACK",
        }),
      ],
    });
  });

  it("classifica orçamento próximo do limite", async () => {
    mockAuthorizedUser();

    listActiveBudgetProgressRecordsMock.mockResolvedValue([
      createRecord({
        plannedAmount: "1000.0000",
        spentAmount: "800.0000",
      }),
    ]);

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: true,
      budgets: [
        expect.objectContaining({
          remainingAmount: "200.0000",
          percentage: 80,
          status: "NEAR_LIMIT",
        }),
      ],
    });
  });

  it("mantém 100% como limite atingido", async () => {
    mockAuthorizedUser();

    listActiveBudgetProgressRecordsMock.mockResolvedValue([
      createRecord({
        plannedAmount: "1000.0000",
        spentAmount: "1000.0000",
      }),
    ]);

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: true,
      budgets: [
        expect.objectContaining({
          remainingAmount: "0.0000",
          percentage: 100,
          status: "NEAR_LIMIT",
        }),
      ],
    });
  });

  it("classifica orçamento ultrapassado", async () => {
    mockAuthorizedUser();

    listActiveBudgetProgressRecordsMock.mockResolvedValue([
      createRecord({
        plannedAmount: "1000.0000",
        spentAmount: "1250.0000",
      }),
    ]);

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: true,
      budgets: [
        expect.objectContaining({
          remainingAmount: "-250.0000",
          percentage: 125,
          status: "EXCEEDED",
        }),
      ],
    });
  });

  it("consulta exatamente o período solicitado", async () => {
    mockAuthorizedUser();

    listActiveBudgetProgressRecordsMock.mockResolvedValue([]);

    await listBudgets({
      workspaceId,
      month: 8,
      year: 2026,
    });

    expect(listActiveBudgetProgressRecordsMock).toHaveBeenCalledWith({
      workspaceId,
      month: 8,
      year: 2026,
      startDate: new Date("2026-08-01T00:00:00.000Z"),
      endDate: new Date("2026-09-01T00:00:00.000Z"),
    });
  });

  it("retorna erro seguro quando o Repository falha", async () => {
    mockAuthorizedUser();

    listActiveBudgetProgressRecordsMock.mockRejectedValue(new Error("Database error"));

    const result = await listBudgets(createValidInput());

    expect(result).toEqual({
      success: false,
      message: "Não foi possível carregar os orçamentos. Tente novamente.",
    });
  });
});

function createValidInput() {
  return {
    workspaceId,
    month: 8,
    year: 2026,
  };
}

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

function mockAuthorizedUser() {
  mockMembership();
  canReadBudgetsMock.mockReturnValue(true);
}

function createRecord(
  overrides: Partial<{
    plannedAmount: string;
    spentAmount: string;
  }> = {},
) {
  return {
    id: "770e8400-e29b-41d4-a716-446655440000",
    workspaceId,
    categoryId,
    categoryName: "Alimentação",
    month: 8,
    year: 2026,

    plannedAmount: overrides.plannedAmount ?? "1000.0000",

    spentAmount: overrides.spentAmount ?? "0.0000",

    createdAt: new Date("2026-08-01T10:00:00.000Z"),

    updatedAt: new Date("2026-08-01T10:00:00.000Z"),
  };
}
