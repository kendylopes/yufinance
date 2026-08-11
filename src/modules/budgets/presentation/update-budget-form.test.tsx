// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { updateBudgetActionMock, replaceMock, refreshMock } = vi.hoisted(() => ({
  updateBudgetActionMock: vi.fn(),
  replaceMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

vi.mock("./update-budget.actions", () => ({
  updateBudgetAction: updateBudgetActionMock,
}));

import { UpdateBudgetForm } from "./update-budget-form";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const budgetId = "660e8400-e29b-41d4-a716-446655440000";

const categoryId = "770e8400-e29b-41d4-a716-446655440000";

describe("UpdateBudgetForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("carrega os valores atuais do orçamento", () => {
    renderForm();

    const monthInput = screen.getByRole("spinbutton", {
      name: "Mês",
    }) as HTMLInputElement;

    const yearInput = screen.getByRole("spinbutton", {
      name: "Ano",
    }) as HTMLInputElement;

    const amountInput = screen.getByRole("textbox", {
      name: "Valor planejado",
    }) as HTMLInputElement;

    expect(monthInput.value).toBe("8");
    expect(yearInput.value).toBe("2026");

    expect(amountInput.value).toBe("1200.0000");
  });

  it("exibe erro quando o mês é inválido", async () => {
    const user = userEvent.setup();

    renderForm();

    const monthInput = screen.getByRole("spinbutton", {
      name: "Mês",
    });

    await user.clear(monthInput);
    await user.type(monthInput, "13");

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(await screen.findByText("O mês deve estar entre 1 e 12.")).toBeTruthy();

    expect(updateBudgetActionMock).not.toHaveBeenCalled();
  });

  it("exibe erro quando o valor planejado é inválido", async () => {
    const user = userEvent.setup();

    renderForm();

    const amountInput = screen.getByRole("textbox", {
      name: "Valor planejado",
    });

    await user.clear(amountInput);
    await user.type(amountInput, "0");

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(await screen.findByText("O valor planejado deve ser maior que zero.")).toBeTruthy();

    expect(updateBudgetActionMock).not.toHaveBeenCalled();
  });

  it("envia os dados atualizados para a Server Action", async () => {
    const user = userEvent.setup();

    updateBudgetActionMock.mockResolvedValue({
      success: true,
      budget: {
        id: budgetId,
        workspaceId,
        categoryId,
        month: 9,
        year: 2026,
        plannedAmount: "1500.0000",
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    renderForm();

    const monthInput = screen.getByRole("spinbutton", {
      name: "Mês",
    });

    const amountInput = screen.getByRole("textbox", {
      name: "Valor planejado",
    });

    await user.clear(monthInput);
    await user.type(monthInput, "9");

    await user.clear(amountInput);
    await user.type(amountInput, "1500");

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(updateBudgetActionMock).toHaveBeenCalledWith({
      workspaceId,
      budgetId,
      month: 9,
      year: 2026,
      plannedAmount: 1500,
    });
  });

  it("exibe mensagem quando a atualização falha", async () => {
    const user = userEvent.setup();

    updateBudgetActionMock.mockResolvedValue({
      success: false,
      message: "Não foi possível atualizar o orçamento. Tente novamente.",
    });

    renderForm();

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(
      await screen.findByText("Não foi possível atualizar o orçamento. Tente novamente."),
    ).toBeTruthy();

    expect(replaceMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("retorna para a listagem após atualizar", async () => {
    const user = userEvent.setup();

    updateBudgetActionMock.mockResolvedValue({
      success: true,
      budget: {
        id: budgetId,
        workspaceId,
        categoryId,
        month: 8,
        year: 2026,
        plannedAmount: "1200.0000",
        archivedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    renderForm();

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(replaceMock).toHaveBeenCalledWith("/dashboard/budgets");

    expect(refreshMock).toHaveBeenCalledOnce();
  });
});

function renderForm() {
  render(
    <UpdateBudgetForm
      workspaceId={workspaceId}
      budgetId={budgetId}
      defaultValues={{
        month: 8,
        year: 2026,
        plannedAmount: "1200.0000",
      }}
    />,
  );
}
