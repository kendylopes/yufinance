import { describe, expect, it } from "vitest";

import { updateFinancialAccountSchema } from "./update-financial-account.schema";

describe("updateFinancialAccountSchema", () => {
  it("aceita dados válidos", () => {
    const result = updateFinancialAccountSchema.safeParse({
      name: "Nubank Principal",
      type: "DIGITAL",
    });

    expect(result.success).toBe(true);
  });

  it("remove espaços desnecessários do nome", () => {
    const result = updateFinancialAccountSchema.safeParse({
      name: "  Nubank Principal  ",
      type: "DIGITAL",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Nubank Principal");
    }
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    const result = updateFinancialAccountSchema.safeParse({
      name: "N",
      type: "DIGITAL",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita nome com mais de 80 caracteres", () => {
    const result = updateFinancialAccountSchema.safeParse({
      name: "N".repeat(81),
      type: "DIGITAL",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita tipo desconhecido", () => {
    const result = updateFinancialAccountSchema.safeParse({
      name: "Nubank",
      type: "INVESTMENT",
    });

    expect(result.success).toBe(false);
  });

  it.each(["CHECKING", "SAVINGS", "DIGITAL", "WALLET", "CASH"] as const)(
    "aceita o tipo %s",
    (type) => {
      const result = updateFinancialAccountSchema.safeParse({
        name: "Conta Financeira",
        type,
      });

      expect(result.success).toBe(true);
    },
  );
});
