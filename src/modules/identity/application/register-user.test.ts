import { beforeEach, describe, expect, it, vi } from "vitest";

import { authClient } from "../infrastructure/auth-client";
import { registerUser } from "./register-user";

vi.mock("../infrastructure/auth-client", () => ({
  authClient: {
    signUp: {
      email: vi.fn(),
    },
  },
}));

const signUpEmailMock = vi.mocked(authClient.signUp.email);

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registra um usuário quando os dados são válidos", async () => {
    signUpEmailMock.mockResolvedValue({
      data: {
        user: {
          id: "user-1",
          name: "Kennedy",
          email: "kennedy@example.com",
          emailVerified: false,
          image: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: "session-token",
      },
      error: null,
    });

    const result = await registerUser({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result).toEqual({
      success: true,
    });

    expect(signUpEmailMock).toHaveBeenCalledOnce();

    expect(signUpEmailMock).toHaveBeenCalledWith({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "12345678",
    });
  });

  it("não chama o Better Auth quando os dados são inválidos", async () => {
    const result = await registerUser({
      name: "K",
      email: "email-invalido",
      password: "123",
      passwordConfirmation: "456",
    });

    expect(result).toEqual({
      success: false,
      message: "Os dados informados não são válidos.",
    });

    expect(signUpEmailMock).not.toHaveBeenCalled();
  });

  it("retorna mensagem segura quando o usuário já existe", async () => {
    signUpEmailMock.mockResolvedValue({
      data: null,
      error: {
        code: "USER_ALREADY_EXISTS",
        message: "User already exists",
        status: 422,
        statusText: "UNPROCESSABLE_ENTITY",
      },
    });

    const result = await registerUser({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível concluir o cadastro com os dados informados.",
    });
  });

  it("retorna mensagem genérica para erro não conhecido", async () => {
    signUpEmailMock.mockResolvedValue({
      data: null,
      error: {
        code: "UNKNOWN_ERROR",
        message: "Unexpected error",
        status: 500,
        statusText: "INTERNAL_SERVER_ERROR",
      },
    });

    const result = await registerUser({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível criar sua conta. Tente novamente.",
    });
  });

  it("trata falha inesperada do serviço de autenticação", async () => {
    signUpEmailMock.mockRejectedValue(new Error("Network error"));

    const result = await registerUser({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result).toEqual({
      success: false,
      message: "Não foi possível conectar ao serviço de autenticação. Tente novamente.",
    });
  });
});
