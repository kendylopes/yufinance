// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { updateTransactionActionMock, replaceMock, refreshMock } = vi.hoisted(() => ({
  updateTransactionActionMock: vi.fn(),
  replaceMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

vi.mock("./update-transaction.actions", () => ({
  updateTransactionAction: updateTransactionActionMock,
}));

import { UpdateTransactionForm } from "./update-transaction-form";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const transactionId = "660e8400-e29b-41d4-a716-446655440000";

const checkingAccountId = "770e8400-e29b-41d4-a716-446655440000";

const secondAccountId = "880e8400-e29b-41d4-a716-446655440000";

const expenseCategoryId = "990e8400-e29b-41d4-a716-446655440000";

const secondExpenseCategoryId = "aa0e8400-e29b-41d4-a716-446655440000";

const incomeCategoryId = "bb0e8400-e29b-41d4-a716-446655440000";

const transaction = {
  id: transactionId,
  financialAccountId: checkingAccountId,
  categoryId: expenseCategoryId,
  type: "EXPENSE" as const,
  description: "Supermercado",
  amount: "150.5000",
  occurredAt: new Date("2026-08-10T15:30:00.000Z"),
  notes: "Compra semanal",
};

const financialAccounts = [
  {
    id: checkingAccountId,
    name: "Conta principal",
  },
  {
    id: secondAccountId,
    name: "Nubank",
  },
];

const categories = [
  {
    id: expenseCategoryId,
    name: "Alimentação",
    type: "EXPENSE" as const,
  },
  {
    id: secondExpenseCategoryId,
    name: "Transporte",
    type: "EXPENSE" as const,
  },
  {
    id: incomeCategoryId,
    name: "Salário",
    type: "INCOME" as const,
  },
];

describe("UpdateTransactionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("carrega os valores atuais da transação", () => {
    renderForm();

    const accountSelect = screen.getByRole("combobox", {
      name: "Conta financeira",
    }) as HTMLSelectElement;

    const typeSelect = screen.getByRole("combobox", {
      name: "Tipo",
    }) as HTMLSelectElement;

    const categorySelect = screen.getByRole("combobox", {
      name: "Categoria",
    }) as HTMLSelectElement;

    const descriptionInput = screen.getByRole("textbox", {
      name: "Descrição",
    }) as HTMLInputElement;

    const amountInput = screen.getByRole("spinbutton", {
      name: "Valor",
    }) as HTMLInputElement;

    const notesInput = screen.getByRole("textbox", {
      name: "Observações",
    }) as HTMLTextAreaElement;

    expect(accountSelect.value).toBe(checkingAccountId);
    expect(typeSelect.value).toBe("EXPENSE");
    expect(categorySelect.value).toBe(expenseCategoryId);
    expect(descriptionInput.value).toBe("Supermercado");
    expect(amountInput.value).toBe("150.5");
    expect(notesInput.value).toBe("Compra semanal");
  });

  it("exibe apenas categorias compatíveis com o tipo atual", () => {
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

    expect(
      screen.queryByRole("option", {
        name: "Salário",
      }),
    ).toBeNull();
  });

  it("limpa a categoria quando o tipo é alterado", async () => {
    const user = userEvent.setup();

    renderForm();

    const typeSelect = screen.getByRole("combobox", {
      name: "Tipo",
    });

    await user.selectOptions(typeSelect, "INCOME");

    const categorySelect = screen.getByRole("combobox", {
      name: "Categoria",
    }) as HTMLSelectElement;

    expect(categorySelect.value).toBe("");

    expect(
      screen.getByRole("option", {
        name: "Salário",
      }),
    ).toBeTruthy();

    expect(
      screen.queryByRole("option", {
        name: "Alimentação",
      }),
    ).toBeNull();
  });

  it("envia os dados atualizados para a Server Action", async () => {
    const user = userEvent.setup();

    updateTransactionActionMock.mockResolvedValue({
      success: true,
    });

    renderForm();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Conta financeira",
      }),
      secondAccountId,
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Categoria",
      }),
      secondExpenseCategoryId,
    );

    const descriptionInput = screen.getByRole("textbox", {
      name: "Descrição",
    });

    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Combustível");

    const amountInput = screen.getByRole("spinbutton", {
      name: "Valor",
    });

    await user.clear(amountInput);
    await user.type(amountInput, "220.75");

    const notesInput = screen.getByRole("textbox", {
      name: "Observações",
    });

    await user.clear(notesInput);
    await user.type(notesInput, "Abastecimento");

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(updateTransactionActionMock).toHaveBeenCalledOnce();

    expect(updateTransactionActionMock).toHaveBeenCalledWith({
      workspaceId,
      transactionId,
      transaction: expect.objectContaining({
        financialAccountId: secondAccountId,
        categoryId: secondExpenseCategoryId,
        type: "EXPENSE",
        description: "Combustível",
        amount: "220.7500",
        occurredAt: expect.any(Date),
        notes: "Abastecimento",
      }),
    });
  });

  it("exibe mensagem quando a atualização falha", async () => {
    const user = userEvent.setup();

    updateTransactionActionMock.mockResolvedValue({
      success: false,
      message: "Não foi possível atualizar a transação. Tente novamente.",
    });

    renderForm();

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(
      await screen.findByText("Não foi possível atualizar a transação. Tente novamente."),
    ).toBeTruthy();

    expect(replaceMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("retorna para a listagem após atualizar a transação", async () => {
    const user = userEvent.setup();

    updateTransactionActionMock.mockResolvedValue({
      success: true,
    });

    renderForm();

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(replaceMock).toHaveBeenCalledWith("/dashboard/transactions");
    expect(refreshMock).toHaveBeenCalledOnce();
  });
});

function renderForm() {
  render(
    <UpdateTransactionForm
      workspaceId={workspaceId}
      transaction={transaction}
      financialAccounts={financialAccounts}
      categories={categories}
    />,
  );
}
