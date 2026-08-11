import { describe, expect, it } from "vitest";

import { createBudgetSchema } from "./create-budget.schema";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const categoryId = "660e8400-e29b-41d4-a716-446655440000";

describe("createBudgetSchema", () => {
  it("aceita entrada válida", () => {
    const result = createBudgetSchema.safeParse({
      workspaceId,
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result.success).toBe(true);
  });

  it("converte valor monetário recebido como string", () => {
    const result = createBudgetSchema.parse({
      workspaceId,
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: "1200.50",
    });

    expect(result.plannedAmount).toBe(1200.5);
  });

  it("rejeita workspace inválido", () => {
    const result = createBudgetSchema.safeParse({
      workspaceId: "invalid",
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita categoria inválida", () => {
    const result = createBudgetSchema.safeParse({
      workspaceId,
      categoryId: "invalid",
      month: 8,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita mês inferior a 1", () => {
    const result = createBudgetSchema.safeParse({
      workspaceId,
      categoryId,
      month: 0,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita mês superior a 12", () => {
    const result = createBudgetSchema.safeParse({
      workspaceId,
      categoryId,
      month: 13,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita valor planejado igual a zero", () => {
    const result = createBudgetSchema.safeParse({
      workspaceId,
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: 0,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita valor planejado negativo", () => {
    const result = createBudgetSchema.safeParse({
      workspaceId,
      categoryId,
      month: 8,
      year: 2026,
      plannedAmount: -100,
    });

    expect(result.success).toBe(false);
  });
});
