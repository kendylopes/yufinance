// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./create-budget.actions", () => ({
  createBudgetAction: vi.fn(),
}));

import { createBudgetAction } from "./create-budget.actions";
import { CreateBudgetForm } from "./create-budget-form";

const createBudgetActionMock = vi.mocked(createBudgetAction);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const categoryId = "660e8400-e29b-41d4-a716-446655440000";

const categories = [
  {
    id: categoryId,
    name: "Alimentação",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440000",
    name: "Transporte",
  },
];

describe("CreateBudgetForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("carrega as categorias disponíveis", () => {
    renderForm();

    expect(
      screen.getByRole("option", {
        name: "Alimentação",
      }),
    ).toBeTruthy();

    expect(
      screen.getByRole("option", {
        name: "Transporte",
      }),
    ).toBeTruthy();
  });

  it("exibe erro quando o valor planejado é inválido", async () => {
    const user = userEvent.setup();

    renderForm();

    const amountInput = screen.getByRole("textbox", {
      name: "Valor planejado",
    });

    await user.type(amountInput, "0");

    await user.click(
      screen.getByRole("button", {
        name: "Criar orçamento",
      }),
    );

    expect(await screen.findByText("O valor planejado deve ser maior que zero.")).toBeTruthy();

    expect(createBudgetActionMock).not.toHaveBeenCalled();
  });

  it("envia os dados para a Server Action", async () => {
    const user = userEvent.setup();

    createBudgetActionMock.mockResolvedValue({
      success: true,
      budget: {
        id: "budget-1",
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

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Categoria",
      }),
      categoryId,
    );

    const monthInput = screen.getByRole("spinbutton", {
      name: "Mês",
    });

    const yearInput = screen.getByRole("spinbutton", {
      name: "Ano",
    });

    await user.clear(monthInput);
    await user.type(monthInput, "8");

    await user.clear(yearInput);
    await user.type(yearInput, "2026");

    await user.type(
      screen.getByRole("textbox", {
        name: "Valor planejado",
      }),
      "1200",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Criar orçamento",
      }),
    );

    expect(createBudgetActionMock).toHaveBeenCalledWith({
      workspaceId,
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: 1200,
    });
  });

  it("exibe mensagem quando a criação falha", async () => {
    const user = userEvent.setup();

    createBudgetActionMock.mockResolvedValue({
      success: false,
      message: "Já existe um orçamento ativo para esta categoria no período informado.",
    });

    renderForm();

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Criar orçamento",
      }),
    );

    expect(
      await screen.findByText(
        "Já existe um orçamento ativo para esta categoria no período informado.",
      ),
    ).toBeTruthy();
  });

  it("exibe sucesso e limpa o valor após criar orçamento", async () => {
    const user = userEvent.setup();

    createBudgetActionMock.mockResolvedValue({
      success: true,
      budget: {
        id: "budget-1",
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

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Criar orçamento",
      }),
    );

    expect(await screen.findByText("Orçamento criado com sucesso.")).toBeTruthy();

    const amountInput = screen.getByRole("textbox", {
      name: "Valor planejado",
    }) as HTMLInputElement;

    expect(amountInput.value).toBe("");
  });
});

function renderForm() {
  render(<CreateBudgetForm workspaceId={workspaceId} categories={categories} />);
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  const monthInput = screen.getByRole("spinbutton", {
    name: "Mês",
  });

  const yearInput = screen.getByRole("spinbutton", {
    name: "Ano",
  });

  await user.clear(monthInput);
  await user.type(monthInput, "8");

  await user.clear(yearInput);
  await user.type(yearInput, "2026");

  await user.type(
    screen.getByRole("textbox", {
      name: "Valor planejado",
    }),
    "1200",
  );
}
