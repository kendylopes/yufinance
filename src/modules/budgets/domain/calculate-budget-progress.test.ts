import { describe, expect, it } from "vitest";

import { calculateBudgetProgress } from "./calculate-budget-progress";

describe("calculateBudgetProgress", () => {
  it("calcula orçamento dentro do limite", () => {
    const result = calculateBudgetProgress({
      plannedAmount: "1000.0000",
      spentAmount: "500.0000",
    });

    expect(result).toEqual({
      plannedAmount: "1000.0000",
      spentAmount: "500.0000",
      remainingAmount: "500.0000",
      percentage: 50,
      status: "ON_TRACK",
    });
  });

  it("classifica 79.99% como ON_TRACK", () => {
    const result = calculateBudgetProgress({
      plannedAmount: "1000.0000",
      spentAmount: "799.9000",
    });

    expect(result.percentage).toBe(79.99);
    expect(result.status).toBe("ON_TRACK");
  });

  it("classifica 80% como NEAR_LIMIT", () => {
    const result = calculateBudgetProgress({
      plannedAmount: "1000.0000",
      spentAmount: "800.0000",
    });

    expect(result.percentage).toBe(80);
    expect(result.status).toBe("NEAR_LIMIT");
  });

  it("classifica 100% como NEAR_LIMIT", () => {
    const result = calculateBudgetProgress({
      plannedAmount: "1000.0000",
      spentAmount: "1000.0000",
    });

    expect(result).toEqual({
      plannedAmount: "1000.0000",
      spentAmount: "1000.0000",
      remainingAmount: "0.0000",
      percentage: 100,
      status: "NEAR_LIMIT",
    });
  });

  it("classifica valor acima de 100% como EXCEEDED", () => {
    const result = calculateBudgetProgress({
      plannedAmount: "1000.0000",
      spentAmount: "1250.0000",
    });

    expect(result).toEqual({
      plannedAmount: "1000.0000",
      spentAmount: "1250.0000",
      remainingAmount: "-250.0000",
      percentage: 125,
      status: "EXCEEDED",
    });
  });

  it("preserva quatro casas decimais", () => {
    const result = calculateBudgetProgress({
      plannedAmount: "1200.5000",
      spentAmount: "200.1250",
    });

    expect(result.plannedAmount).toBe("1200.5000");
    expect(result.spentAmount).toBe("200.1250");
    expect(result.remainingAmount).toBe("1000.3750");
  });

  it("aceita zero como valor gasto", () => {
    const result = calculateBudgetProgress({
      plannedAmount: "500.0000",
      spentAmount: "0",
    });

    expect(result).toEqual({
      plannedAmount: "500.0000",
      spentAmount: "0.0000",
      remainingAmount: "500.0000",
      percentage: 0,
      status: "ON_TRACK",
    });
  });

  it("rejeita valor planejado igual a zero", () => {
    expect(() =>
      calculateBudgetProgress({
        plannedAmount: "0.0000",
        spentAmount: "0.0000",
      }),
    ).toThrow("O valor planejado deve ser maior que zero.");
  });

  it("não sofre erro de ponto flutuante em valores decimais", () => {
    const result = calculateBudgetProgress({
      plannedAmount: "0.3000",
      spentAmount: "0.1000",
    });

    expect(result.remainingAmount).toBe("0.2000");
    expect(result.percentage).toBe(33.33);
  });
});
