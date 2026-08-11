import { describe, expect, it } from "vitest";

import { updateBudgetSchema } from "./update-budget.schema";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const budgetId = "660e8400-e29b-41d4-a716-446655440000";

describe("updateBudgetSchema", () => {
  it("aceita entrada válida", () => {
    const result = updateBudgetSchema.safeParse({
      workspaceId,
      budgetId,
      month: 8,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result.success).toBe(true);
  });

  it("converte valor planejado recebido como string", () => {
    const result = updateBudgetSchema.parse({
      workspaceId,
      budgetId,
      month: 8,
      year: 2026,
      plannedAmount: "1200.50",
    });

    expect(result.plannedAmount).toBe(1200.5);
  });

  it("rejeita orçamento inválido", () => {
    const result = updateBudgetSchema.safeParse({
      workspaceId,
      budgetId: "invalid",
      month: 8,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita mês fora do intervalo", () => {
    const result = updateBudgetSchema.safeParse({
      workspaceId,
      budgetId,
      month: 13,
      year: 2026,
      plannedAmount: 1200,
    });

    expect(result.success).toBe(false);
  });

  it("rejeita valor planejado igual a zero", () => {
    const result = updateBudgetSchema.safeParse({
      workspaceId,
      budgetId,
      month: 8,
      year: 2026,
      plannedAmount: 0,
    });

    expect(result.success).toBe(false);
  });
});
