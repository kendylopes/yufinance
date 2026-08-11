import { describe, expect, it } from "vitest";

import { createTransactionSchema } from "./create-transaction.schema";

describe("createTransactionSchema", () => {
  it("accepts a valid income transaction", () => {
    const result = createTransactionSchema.safeParse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "INCOME",
      description: "Salary",
      amount: 2500,
      occurredAt: new Date(),
      notes: "Monthly salary",
    });

    expect(result.success).toBe(true);
  });

  it("accepts a valid expense transaction", () => {
    const result = createTransactionSchema.safeParse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "Market",
      amount: 120.5,
      occurredAt: new Date(),
    });

    expect(result.success).toBe(true);
  });

  it("trims the description", () => {
    const result = createTransactionSchema.parse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "  Market  ",
      amount: 10,
      occurredAt: new Date(),
    });

    expect(result.description).toBe("Market");
  });

  it("formats amount with four decimal places", () => {
    const result = createTransactionSchema.parse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "Fuel",
      amount: 25,
      occurredAt: new Date(),
    });

    expect(result.amount).toBe("25.0000");
  });

  it("rejects amount less than or equal to zero", () => {
    const result = createTransactionSchema.safeParse({
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
    const result = createTransactionSchema.safeParse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "A",
      amount: 10,
      occurredAt: new Date(),
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid transaction type", () => {
    const result = createTransactionSchema.safeParse({
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
    const result = createTransactionSchema.parse({
      financialAccountId: "550e8400-e29b-41d4-a716-446655440000",
      categoryId: "660e8400-e29b-41d4-a716-446655440000",
      type: "EXPENSE",
      description: "Fuel",
      amount: 50,
      occurredAt: new Date(),
      notes: "",
    });

    expect(result.notes).toBeNull();
  });
});
