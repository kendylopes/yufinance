// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { registerUser } from "../application/register-user";
import { SignUpForm } from "./sign-up-form";

vi.mock("../application/register-user", () => ({
  registerUser: vi.fn(),
}));

const registerUserMock = vi.mocked(registerUser);

describe("SignUpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("exibe erros quando os dados informados são inválidos", async () => {
    const user = userEvent.setup();

    render(<SignUpForm />);

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(await screen.findByText("O nome deve ter pelo menos 2 caracteres.")).toBeTruthy();

    expect(screen.getByText("Informe um e-mail válido.")).toBeTruthy();

    expect(screen.getByText("A senha deve ter pelo menos 8 caracteres.")).toBeTruthy();

    expect(screen.getByText("Confirme a senha.")).toBeTruthy();

    expect(registerUserMock).not.toHaveBeenCalled();
  });

  it("envia os dados válidos para registerUser", async () => {
    registerUserMock.mockResolvedValue({
      success: true,
    });

    const user = userEvent.setup();

    render(<SignUpForm />);

    await user.type(
      screen.getByRole("textbox", {
        name: "Nome",
      }),
      "Kennedy",
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "E-mail",
      }),
      "kennedy@example.com",
    );

    await user.type(screen.getByLabelText("Senha"), "12345678");

    await user.type(screen.getByLabelText("Confirmar senha"), "12345678");

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(registerUserMock).toHaveBeenCalledWith({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });
  });

  it("exibe mensagem quando o cadastro falha", async () => {
    registerUserMock.mockResolvedValue({
      success: false,
      message: "Não foi possível criar sua conta. Tente novamente.",
    });

    const user = userEvent.setup();

    render(<SignUpForm />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(
      await screen.findByText("Não foi possível criar sua conta. Tente novamente."),
    ).toBeTruthy();
  });

  it("exibe mensagem de sucesso quando a conta é criada", async () => {
    registerUserMock.mockResolvedValue({
      success: true,
    });

    const user = userEvent.setup();

    render(<SignUpForm />);

    await fillValidForm(user);

    await user.click(
      screen.getByRole("button", {
        name: "Criar conta",
      }),
    );

    expect(await screen.findByText("Conta criada com sucesso.")).toBeTruthy();
  });
});

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole("textbox", {
      name: "Nome",
    }),
    "Kennedy",
  );

  await user.type(
    screen.getByRole("textbox", {
      name: "E-mail",
    }),
    "kennedy@example.com",
  );

  await user.type(screen.getByLabelText("Senha"), "12345678");

  await user.type(screen.getByLabelText("Confirmar senha"), "12345678");
}
