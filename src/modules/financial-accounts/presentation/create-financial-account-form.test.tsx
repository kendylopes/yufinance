// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./create-financial-account.actions", () => ({
  createFinancialAccountAction: vi.fn(),
}));

import { createFinancialAccountAction } from "./create-financial-account.actions";
import { CreateFinancialAccountForm } from "./create-financial-account-form";

const createFinancialAccountActionMock = vi.mocked(createFinancialAccountAction);

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

describe("CreateFinancialAccountForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("exibe erro quando o nome é inválido", async () => {
    const user = userEvent.setup();

    render(<CreateFinancialAccountForm workspaceId={workspaceId} />);

    const nameInput = screen.getByRole("textbox", {
      name: "Nome da conta",
    });

    await user.clear(nameInput);
    await user.type(nameInput, "N");

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(await screen.findByText("O nome deve ter pelo menos 2 caracteres.")).toBeTruthy();

    expect(createFinancialAccountActionMock).not.toHaveBeenCalled();
  });

  it("utiliza CHECKING e saldo zero como valores padrão", async () => {
    const user = userEvent.setup();

    createFinancialAccountActionMock.mockResolvedValue({
      success: true,
      financialAccountId: "financial-account-1",
    });

    render(<CreateFinancialAccountForm workspaceId={workspaceId} />);

    await user.type(
      screen.getByRole("textbox", {
        name: "Nome da conta",
      }),
      "Conta principal",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(createFinancialAccountActionMock).toHaveBeenCalledWith({
      workspaceId,
      data: {
        name: "Conta principal",
        type: "CHECKING",
        initialBalance: "0",
      },
    });
  });

  it("envia os dados informados para a Server Action", async () => {
    const user = userEvent.setup();

    createFinancialAccountActionMock.mockResolvedValue({
      success: true,
      financialAccountId: "financial-account-1",
    });

    render(<CreateFinancialAccountForm workspaceId={workspaceId} />);

    await user.type(
      screen.getByRole("textbox", {
        name: "Nome da conta",
      }),
      "Nubank",
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Tipo",
      }),
      "DIGITAL",
    );

    const balanceInput = screen.getByRole("textbox", {
      name: "Saldo inicial",
    });

    await user.clear(balanceInput);
    await user.type(balanceInput, "1500,25");

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(createFinancialAccountActionMock).toHaveBeenCalledWith({
      workspaceId,
      data: {
        name: "Nubank",
        type: "DIGITAL",
        initialBalance: "1500.25",
      },
    });
  });

  it("exibe mensagem quando a criação falha", async () => {
    const user = userEvent.setup();

    createFinancialAccountActionMock.mockResolvedValue({
      success: false,
      message: "Não foi possível criar a conta financeira.",
    });

    render(<CreateFinancialAccountForm workspaceId={workspaceId} />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(await screen.findByText("Não foi possível criar a conta financeira.")).toBeTruthy();
  });

  it("exibe sucesso e limpa o formulário após criar a conta", async () => {
    const user = userEvent.setup();

    createFinancialAccountActionMock.mockResolvedValue({
      success: true,
      financialAccountId: "financial-account-1",
    });

    render(<CreateFinancialAccountForm workspaceId={workspaceId} />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(await screen.findByText("Conta financeira criada com sucesso.")).toBeTruthy();

    const nameInput = screen.getByRole("textbox", {
      name: "Nome da conta",
    }) as HTMLInputElement;

    const typeSelect = screen.getByRole("combobox", {
      name: "Tipo",
    }) as HTMLSelectElement;

    const initialBalanceInput = screen.getByRole("textbox", {
      name: "Saldo inicial",
    }) as HTMLInputElement;

    expect(nameInput.value).toBe("");
    expect(typeSelect.value).toBe("CHECKING");
    expect(initialBalanceInput.value).toBe("0");
  });
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole("textbox", {
      name: "Nome da conta",
    }),
    "Nubank",
  );

  await user.selectOptions(
    screen.getByRole("combobox", {
      name: "Tipo",
    }),
    "DIGITAL",
  );
}
