import { describe, expect, it } from "vitest";

import { updateTransactionSchema } from "./update-transaction.schema";

describe("updateTransactionSchema", () => {
  it("accepts valid data", () => {
    const result = updateTransactionSchema.safeParse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "INCOME",
      description: "Salary",
      amount: 3500,
      occurredAt: new Date(),
      notes: "Monthly salary",
    });

    expect(result.success).toBe(true);
  });

  it("trims the description", () => {
    const result = updateTransactionSchema.parse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "  Fuel  ",
      amount: 100,
      occurredAt: new Date(),
    });

    expect(result.description).toBe("Fuel");
  });

  it("formats amount with four decimal places", () => {
    const result = updateTransactionSchema.parse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "Fuel",
      amount: 10,
      occurredAt: new Date(),
    });

    expect(result.amount).toBe("10.0000");
  });

  it("rejects amount less than or equal to zero", () => {
    const result = updateTransactionSchema.safeParse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "Fuel",
      amount: 0,
      occurredAt: new Date(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects description shorter than 2 characters", () => {
    const result = updateTransactionSchema.safeParse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "A",
      amount: 100,
      occurredAt: new Date(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid type", () => {
    const result = updateTransactionSchema.safeParse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "TRANSFER",
      description: "Transfer",
      amount: 100,
      occurredAt: new Date(),
    });

    expect(result.success).toBe(false);
  });

  it("converts empty notes to null", () => {
    const result = updateTransactionSchema.parse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "Fuel",
      amount: 100,
      occurredAt: new Date(),
      notes: "",
    });

    expect(result.notes).toBeNull();
  });

  it("accepts missing notes", () => {
    const result = updateTransactionSchema.safeParse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "Fuel",
      amount: 100,
      occurredAt: new Date(),
    });

    expect(result.success).toBe(true);
  });
});
