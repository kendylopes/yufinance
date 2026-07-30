import { describe, expect, it } from "vitest";

import { createFinancialAccountSchema } from "./create-financial-account.schema";

describe("createFinancialAccountSchema", () => {
  it("aceita dados válidos", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "Nubank",
      type: "DIGITAL",
      initialBalance: "1500.25",
    });

    expect(result.success).toBe(true);
  });

  it("remove espaços desnecessários do nome", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "  Nubank  ",
      type: "DIGITAL",
      initialBalance: "0",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Nubank");
    }
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "N",
      type: "DIGITAL",
      initialBalance: "0",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita tipo desconhecido", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "Conta",
      type: "INVESTMENT",
      initialBalance: "0",
    });

    expect(result.success).toBe(false);
  });

  it("aceita saldo inicial zero", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "Carteira",
      type: "WALLET",
      initialBalance: "0",
    });

    expect(result.success).toBe(true);
  });

  it("aceita saldo inicial negativo", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "Conta Corrente",
      type: "CHECKING",
      initialBalance: "-350.50",
    });

    expect(result.success).toBe(true);
  });

  it("normaliza vírgula decimal para ponto", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "Poupança",
      type: "SAVINGS",
      initialBalance: "1500,25",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.initialBalance).toBe("1500.25");
    }
  });

  it("aceita até quatro casas decimais", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "Conta",
      type: "CHECKING",
      initialBalance: "10.1234",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita mais de quatro casas decimais", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "Conta",
      type: "CHECKING",
      initialBalance: "10.12345",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita valor monetário inválido", () => {
    const result = createFinancialAccountSchema.safeParse({
      name: "Conta",
      type: "CHECKING",
      initialBalance: "R$ 100,00",
    });

    expect(result.success).toBe(false);
  });
});
