import { describe, expect, it } from "vitest";

import { getDashboardInsights } from "./get-dashboard-insights";

describe("getDashboardInsights", () => {
  it("retorna insight quando não existem transações", () => {
    const result = getDashboardInsights({
      summary: createSummary(),
      kpis: {
        ...createKpis(),
        periodTransactionsCount: 0,
      },
      incomeExpense: {
        income: "0.0000",
        expense: "0.0000",
      },
      categoryExpenses: {
        totalExpense: "0.0000",
        categories: [],
      },
    });

    expect(result).toEqual([
      {
        id: "no-transactions",
        title: "Sem movimentações",
        description: "Ainda não existem transações no período selecionado.",
        severity: "info",
      },
    ]);
  });

  it("retorna insight para resultado positivo", () => {
    const result = getDashboardInsights({
      summary: {
        ...createSummary(),
        monthlyResult: "500.0000",
      },
      kpis: createKpis(),
      incomeExpense: {
        income: "1500.0000",
        expense: "1000.0000",
      },
      categoryExpenses: {
        totalExpense: "1000.0000",
        categories: [],
      },
    });

    expect(result).toContainEqual({
      id: "positive-result",
      title: "Resultado positivo",
      description: "As receitas superaram as despesas no período selecionado.",
      severity: "success",
    });
  });

  it("retorna insight para resultado negativo", () => {
    const result = getDashboardInsights({
      summary: {
        ...createSummary(),
        monthlyResult: "-250.0000",
      },
      kpis: createKpis(),
      incomeExpense: {
        income: "750.0000",
        expense: "1000.0000",
      },
      categoryExpenses: {
        totalExpense: "1000.0000",
        categories: [],
      },
    });

    expect(result).toContainEqual({
      id: "negative-result",
      title: "Atenção às despesas",
      description: "As despesas superaram as receitas no período selecionado.",
      severity: "warning",
    });
  });

  it("retorna insight quando não existem receitas", () => {
    const result = getDashboardInsights({
      summary: {
        ...createSummary(),
        monthlyResult: "-500.0000",
      },
      kpis: createKpis(),
      incomeExpense: {
        income: "0.0000",
        expense: "500.0000",
      },
      categoryExpenses: {
        totalExpense: "500.0000",
        categories: [],
      },
    });

    expect(result).toContainEqual({
      id: "no-income",
      title: "Nenhuma receita registrada",
      description: "Existem despesas no período, mas nenhuma receita foi registrada.",
      severity: "warning",
    });
  });

  it("retorna insight para categoria dominante", () => {
    const result = getDashboardInsights({
      summary: createSummary(),
      kpis: createKpis(),
      incomeExpense: {
        income: "1000.0000",
        expense: "1000.0000",
      },
      categoryExpenses: {
        totalExpense: "1000.0000",
        categories: [
          {
            categoryId: "550e8400-e29b-41d4-a716-446655440000",
            categoryName: "Alimentação",
            amount: "500.0000",
            percentage: 50,
          },
        ],
      },
    });

    expect(result).toContainEqual({
      id: "dominant-category",
      title: "Categoria com maior peso",
      description: "Alimentação representa 50.00% das despesas do período.",
      severity: "info",
    });
  });

  it("retorna insight para alta atividade", () => {
    const result = getDashboardInsights({
      summary: createSummary(),
      kpis: {
        ...createKpis(),
        periodTransactionsCount: 60,
      },
      incomeExpense: {
        income: "1000.0000",
        expense: "1000.0000",
      },
      categoryExpenses: {
        totalExpense: "1000.0000",
        categories: [],
      },
    });

    expect(result).toContainEqual({
      id: "high-activity",
      title: "Alta atividade financeira",
      description: "Foram registradas 60 movimentações no período.",
      severity: "info",
    });
  });

  it("retorna insight estável quando não há alertas", () => {
    const result = getDashboardInsights({
      summary: createSummary(),
      kpis: createKpis(),
      incomeExpense: {
        income: "1000.0000",
        expense: "1000.0000",
      },
      categoryExpenses: {
        totalExpense: "1000.0000",
        categories: [
          {
            categoryId: "550e8400-e29b-41d4-a716-446655440000",
            categoryName: "Transporte",
            amount: "300.0000",
            percentage: 30,
          },
        ],
      },
    });

    expect(result).toEqual([
      {
        id: "stable-period",
        title: "Período estável",
        description: "Nenhum alerta financeiro relevante foi identificado neste período.",
        severity: "info",
      },
    ]);
  });
});

function createSummary() {
  return {
    currency: "BRL",
    currentBalance: "1000.0000",
    monthlyIncome: "1000.0000",
    monthlyExpense: "1000.0000",
    monthlyResult: "0.0000",
    activeAccountsCount: 2,
    monthlyTransactionsCount: 10,
  };
}

function createKpis() {
  return {
    activeAccountsCount: 2,
    activeCategoriesCount: 5,
    periodTransactionsCount: 10,
    lastMovementAt: new Date("2026-08-05T12:00:00.000Z"),
  };
}
