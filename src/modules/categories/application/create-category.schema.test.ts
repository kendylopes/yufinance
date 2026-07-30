import { describe, expect, it } from "vitest";

import { createCategorySchema } from "./create-category.schema";

const validInput = {
  workspaceId: "550e8400-e29b-41d4-a716-446655440000",
  name: "Alimentação",
  type: "EXPENSE" as const,
};

describe("createCategorySchema", () => {
  it("accepts a valid expense category", () => {
    const result = createCategorySchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("accepts an income category", () => {
    const result = createCategorySchema.safeParse({
      ...validInput,
      name: "Salário",
      type: "INCOME",
    });

    expect(result.success).toBe(true);
  });

  it("trims the category name", () => {
    const result = createCategorySchema.parse({
      ...validInput,
      name: "  Alimentação  ",
    });

    expect(result.name).toBe("Alimentação");
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = createCategorySchema.safeParse({
      ...validInput,
      name: "A",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 60 characters", () => {
    const result = createCategorySchema.safeParse({
      ...validInput,
      name: "A".repeat(61),
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid category type", () => {
    const result = createCategorySchema.safeParse({
      ...validInput,
      type: "TRANSFER",
    });

    expect(result.success).toBe(false);
  });
});
