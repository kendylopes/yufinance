import { describe, expect, it } from "vitest";

import { updateCategorySchema } from "./update-category.schema";

describe("updateCategorySchema", () => {
  it("aceita um nome válido", () => {
    const result = updateCategorySchema.safeParse({
      name: "Alimentação",
    });

    expect(result.success).toBe(true);
  });

  it("normaliza espaços no nome", () => {
    const result = updateCategorySchema.safeParse({
      name: "  Alimentação e mercado  ",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso.");
    }

    expect(result.data).toEqual({
      name: "Alimentação e mercado",
    });
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    const result = updateCategorySchema.safeParse({
      name: "A",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita nome com mais de 60 caracteres", () => {
    const result = updateCategorySchema.safeParse({
      name: "A".repeat(61),
    });

    expect(result.success).toBe(false);
  });

  it("remove campos que não pertencem ao contrato de atualização", () => {
    const result = updateCategorySchema.safeParse({
      name: "Alimentação",
      type: "INCOME",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      throw new Error("Era esperado sucesso.");
    }

    expect(result.data).toEqual({
      name: "Alimentação",
    });

    expect(result.data).not.toHaveProperty("type");
  });
});
