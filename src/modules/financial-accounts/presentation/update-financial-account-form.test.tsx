// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { updateFinancialAccountActionMock, replaceMock, refreshMock } = vi.hoisted(() => ({
  updateFinancialAccountActionMock: vi.fn(),
  replaceMock: vi.fn(),
  refreshMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

vi.mock("./update-financial-account.actions", () => ({
  updateFinancialAccountAction: updateFinancialAccountActionMock,
}));

import { UpdateFinancialAccountForm } from "./update-financial-account-form";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";
const financialAccountId = "660e8400-e29b-41d4-a716-446655440000";

describe("UpdateFinancialAccountForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("carrega os valores atuais da conta", () => {
    renderForm();

    const nameInput = screen.getByRole("textbox", {
      name: "Nome da conta",
    }) as HTMLInputElement;

    const typeSelect = screen.getByRole("combobox", {
      name: "Tipo",
    }) as HTMLSelectElement;

    expect(nameInput.value).toBe("Nubank");
    expect(typeSelect.value).toBe("DIGITAL");
  });

  it("exibe erro quando o nome é inválido", async () => {
    const user = userEvent.setup();

    renderForm();

    const nameInput = screen.getByRole("textbox", {
      name: "Nome da conta",
    });

    await user.clear(nameInput);
    await user.type(nameInput, "N");

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(await screen.findByText("O nome deve ter pelo menos 2 caracteres.")).toBeTruthy();

    expect(updateFinancialAccountActionMock).not.toHaveBeenCalled();
  });

  it("envia apenas nome e tipo para atualização", async () => {
    const user = userEvent.setup();

    updateFinancialAccountActionMock.mockResolvedValue({
      success: true,
    });

    renderForm();

    const nameInput = screen.getByRole("textbox", {
      name: "Nome da conta",
    });

    await user.clear(nameInput);
    await user.type(nameInput, "Nubank Principal");

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Tipo",
      }),
      "CHECKING",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(updateFinancialAccountActionMock).toHaveBeenCalledWith({
      workspaceId,
      financialAccountId,
      data: {
        name: "Nubank Principal",
        type: "CHECKING",
      },
    });
  });

  it("exibe mensagem quando a atualização falha", async () => {
    const user = userEvent.setup();

    updateFinancialAccountActionMock.mockResolvedValue({
      success: false,
      message: "Não foi possível atualizar a conta financeira. Tente novamente.",
    });

    renderForm();

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(
      await screen.findByText("Não foi possível atualizar a conta financeira. Tente novamente."),
    ).toBeTruthy();
    expect(replaceMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("retorna para a listagem quando a conta é atualizada", async () => {
    const user = userEvent.setup();

    updateFinancialAccountActionMock.mockResolvedValue({
      success: true,
    });

    renderForm();

    await user.click(
      screen.getByRole("button", {
        name: "Salvar alterações",
      }),
    );

    expect(replaceMock).toHaveBeenCalledWith("/dashboard/accounts");
    expect(refreshMock).toHaveBeenCalledOnce();
  });
});

function renderForm() {
  render(
    <UpdateFinancialAccountForm
      workspaceId={workspaceId}
      financialAccountId={financialAccountId}
      defaultValues={{
        name: "Nubank",
        type: "DIGITAL",
      }}
    />,
  );
}
