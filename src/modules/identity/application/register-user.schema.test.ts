import { describe, expect, it } from "vitest";

import { registerUserSchema } from "./register-user.schema";

describe("registerUserSchema", () => {
  it("aceita dados válidos para cadastro", () => {
    const result = registerUserSchema.safeParse({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result.success).toBe(true);
  });

  it("remove espaços desnecessários do nome", () => {
    const result = registerUserSchema.safeParse({
      name: "  Kennedy  ",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Kennedy");
    }
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    const result = registerUserSchema.safeParse({
      name: "K",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const result = registerUserSchema.safeParse({
      name: "Kennedy",
      email: "email-invalido",
      password: "12345678",
      passwordConfirmation: "12345678",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    const result = registerUserSchema.safeParse({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "1234567",
      passwordConfirmation: "1234567",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita senha com mais de 128 caracteres", () => {
    const password = "a".repeat(129);

    const result = registerUserSchema.safeParse({
      name: "Kennedy",
      email: "kennedy@example.com",
      password,
      passwordConfirmation: password,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita confirmação de senha diferente da senha", () => {
    const result = registerUserSchema.safeParse({
      name: "Kennedy",
      email: "kennedy@example.com",
      password: "12345678",
      passwordConfirmation: "87654321",
    });

    expect(result.success).toBe(false);
  });
});
