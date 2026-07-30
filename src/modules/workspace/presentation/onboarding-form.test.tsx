// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { replaceMock, refreshMock, createInitialWorkspaceActionMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  refreshMock: vi.fn(),
  createInitialWorkspaceActionMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

vi.mock("./onboarding.actions", () => ({
  createInitialWorkspaceAction: createInitialWorkspaceActionMock,
}));

import { OnboardingForm } from "./onboarding-form";

describe("OnboardingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("exibe erro quando o nome é inválido", async () => {
    const user = userEvent.setup();

    render(<OnboardingForm />);

    await user.click(
      screen.getByRole("button", {
        name: "Começar a usar o YuFinance",
      }),
    );

    expect(await screen.findByText("O nome deve ter pelo menos 2 caracteres.")).toBeTruthy();

    expect(createInitialWorkspaceActionMock).not.toHaveBeenCalled();
  });

  it("utiliza PERSONAL como tipo padrão", async () => {
    const user = userEvent.setup();

    createInitialWorkspaceActionMock.mockResolvedValue({
      success: true,
      workspaceId: "550e8400-e29b-41d4-a716-446655440000",
    });

    render(<OnboardingForm />);

    await user.type(
      screen.getByRole("textbox", {
        name: "Nome do espaço",
      }),
      "Minhas Finanças",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Começar a usar o YuFinance",
      }),
    );

    expect(createInitialWorkspaceActionMock).toHaveBeenCalledWith({
      name: "Minhas Finanças",
      type: "PERSONAL",
    });
  });

  it("envia o tipo FAMILY quando selecionado", async () => {
    const user = userEvent.setup();

    createInitialWorkspaceActionMock.mockResolvedValue({
      success: true,
      workspaceId: "550e8400-e29b-41d4-a716-446655440000",
    });

    render(<OnboardingForm />);

    await user.type(
      screen.getByRole("textbox", {
        name: "Nome do espaço",
      }),
      "Família Lopes",
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Tipo",
      }),
      "FAMILY",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Começar a usar o YuFinance",
      }),
    );

    expect(createInitialWorkspaceActionMock).toHaveBeenCalledWith({
      name: "Família Lopes",
      type: "FAMILY",
    });
  });

  it("exibe mensagem quando a criação falha", async () => {
    const user = userEvent.setup();

    createInitialWorkspaceActionMock.mockResolvedValue({
      success: false,
      message: "Não foi possível configurar seu espaço financeiro. Tente novamente.",
    });

    render(<OnboardingForm />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Começar a usar o YuFinance",
      }),
    );

    expect(
      await screen.findByText(
        "Não foi possível configurar seu espaço financeiro. Tente novamente.",
      ),
    ).toBeTruthy();

    expect(replaceMock).not.toHaveBeenCalled();
    expect(refreshMock).not.toHaveBeenCalled();
  });

  it("redireciona para o dashboard quando o Workspace é criado", async () => {
    const user = userEvent.setup();

    createInitialWorkspaceActionMock.mockResolvedValue({
      success: true,
      workspaceId: "550e8400-e29b-41d4-a716-446655440000",
    });

    render(<OnboardingForm />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Começar a usar o YuFinance",
      }),
    );

    expect(replaceMock).toHaveBeenCalledWith("/dashboard");
    expect(refreshMock).toHaveBeenCalledOnce();
  });
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole("textbox", {
      name: "Nome do espaço",
    }),
    "Minhas Finanças",
  );

  await user.selectOptions(
    screen.getByRole("combobox", {
      name: "Tipo",
    }),
    "PERSONAL",
  );
}
