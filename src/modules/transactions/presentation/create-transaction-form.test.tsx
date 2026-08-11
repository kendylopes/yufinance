// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("./create-transaction.actions", () => ({
  createTransactionAction: vi.fn(),
}));

import { createTransactionAction } from "./create-transaction.actions";
import { CreateTransactionForm } from "./create-transaction-form";

const createTransactionActionMock = vi.mocked(createTransactionAction);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const checkingAccountId = "660e8400-e29b-41d4-a716-446655440000";

const expenseCategoryId = "770e8400-e29b-41d4-a716-446655440000";

const incomeCategoryId = "880e8400-e29b-41d4-a716-446655440000";

const financialAccounts = [
  {
    id: checkingAccountId,
    name: "Conta principal",
  },
];

const categories = [
  {
    id: expenseCategoryId,
    name: "Alimentação",
    type: "EXPENSE" as const,
  },
  {
    id: incomeCategoryId,
    name: "Salário",
    type: "INCOME" as const,
  },
];

describe("CreateTransactionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("utiliza despesa como tipo padrão e exibe somente categorias compatíveis", () => {
    renderForm();

    const typeSelect = screen.getByRole("combobox", {
      name: "Tipo",
    }) as HTMLSelectElement;

    expect(typeSelect.value).toBe("EXPENSE");

    expect(
      screen.getByRole("option", {
        name: "Alimentação",
      }),
    ).toBeTruthy();

    expect(
      screen.queryByRole("option", {
        name: "Salário",
      }),
    ).toBeNull();
  });

  it("troca as categorias disponíveis quando o tipo muda", async () => {
    const user = userEvent.setup();

    renderForm();

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Tipo",
      }),
      "INCOME",
    );

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

  it("envia os dados válidos para a Server Action", async () => {
    const user = userEvent.setup();

    createTransactionActionMock.mockResolvedValue({
      success: true,
      transactionId: "990e8400-e29b-41d4-a716-446655440000",
    });

    renderForm();

    await fillValidForm(user);

    await user.type(
      screen.getByRole("textbox", {
        name: "Observações",
      }),
      "Compra semanal",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Criar transação",
      }),
    );

    expect(createTransactionActionMock).toHaveBeenCalledOnce();

    expect(createTransactionActionMock).toHaveBeenCalledWith({
      workspaceId,
      transaction: expect.objectContaining({
        financialAccountId: checkingAccountId,
        categoryId: expenseCategoryId,
        type: "EXPENSE",
        description: "Supermercado",
        amount: "150.5000",
        occurredAt: expect.any(Date),
        notes: "Compra semanal",
      }),
    });
  });

  it("exibe mensagem quando a criação falha", async () => {
    const user = userEvent.setup();

    createTransactionActionMock.mockResolvedValue({
      success: false,
      message: "Não foi possível criar a transação. Tente novamente.",
    });

    renderForm();

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Criar transação",
      }),
    );

    expect(
      await screen.findByText("Não foi possível criar a transação. Tente novamente."),
    ).toBeTruthy();
  });

  it("exibe sucesso e limpa o formulário após criar a transação", async () => {
    const user = userEvent.setup();

    createTransactionActionMock.mockResolvedValue({
      success: true,
      transactionId: "990e8400-e29b-41d4-a716-446655440000",
    });

    renderForm();

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Criar transação",
      }),
    );

    expect(await screen.findByText("Transação criada com sucesso.")).toBeTruthy();

    const accountSelect = screen.getByRole("combobox", {
      name: "Conta financeira",
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

    expect(accountSelect.value).toBe("");
    expect(categorySelect.value).toBe("");
    expect(descriptionInput.value).toBe("");
    expect(amountInput.value).toBe("0");
    expect(notesInput.value).toBe("");
  });
});

function renderForm() {
  render(
    <CreateTransactionForm
      workspaceId={workspaceId}
      financialAccounts={financialAccounts}
      categories={categories}
    />,
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole("combobox", {
      name: "Conta financeira",
    }),
    checkingAccountId,
  );

  await user.selectOptions(
    screen.getByRole("combobox", {
      name: "Categoria",
    }),
    expenseCategoryId,
  );

  await user.type(
    screen.getByRole("textbox", {
      name: "Descrição",
    }),
    "Supermercado",
  );

  const amountInput = screen.getByRole("spinbutton", {
    name: "Valor",
  });

  await user.clear(amountInput);
  await user.type(amountInput, "150.5");
}
