import type { CategoryExpensesChartDto } from "./category-expenses-chart.dto";
import type { DashboardInsightsDto } from "./dashboard-insights.dto";
import type { DashboardKpisDto } from "./dashboard-kpis.dto";
import type { DashboardSummaryDto } from "./dashboard-summary.dto";
import type { IncomeExpenseChartDto } from "./income-expense-chart.dto";

export type GetDashboardInsightsInput = {
  summary: DashboardSummaryDto;
  kpis: DashboardKpisDto;
  incomeExpense: IncomeExpenseChartDto;
  categoryExpenses: CategoryExpensesChartDto;
};

export function getDashboardInsights({
  summary,
  kpis,
  incomeExpense,
  categoryExpenses,
}: GetDashboardInsightsInput): DashboardInsightsDto {
  const insights: DashboardInsightsDto = [];

  const income = Number(incomeExpense.income);
  const expense = Number(incomeExpense.expense);
  const monthlyResult = Number(summary.monthlyResult);

  if (kpis.periodTransactionsCount === 0) {
    insights.push({
      id: "no-transactions",
      title: "Sem movimentações",
      description: "Ainda não existem transações no período selecionado.",
      severity: "info",
    });

    return insights;
  }

  if (monthlyResult > 0) {
    insights.push({
      id: "positive-result",
      title: "Resultado positivo",
      description: "As receitas superaram as despesas no período selecionado.",
      severity: "success",
    });
  }

  if (monthlyResult < 0) {
    insights.push({
      id: "negative-result",
      title: "Atenção às despesas",
      description: "As despesas superaram as receitas no período selecionado.",
      severity: "warning",
    });
  }

  if (income === 0 && expense > 0) {
    insights.push({
      id: "no-income",
      title: "Nenhuma receita registrada",
      description: "Existem despesas no período, mas nenhuma receita foi registrada.",
      severity: "warning",
    });
  }

  const mainCategory = categoryExpenses.categories[0];

  if (mainCategory && mainCategory.percentage >= 40) {
    insights.push({
      id: "dominant-category",
      title: "Categoria com maior peso",
      description: `${mainCategory.categoryName} representa ${mainCategory.percentage.toFixed(
        2,
      )}% das despesas do período.`,
      severity: "info",
    });
  }

  if (kpis.periodTransactionsCount >= 50) {
    insights.push({
      id: "high-activity",
      title: "Alta atividade financeira",
      description: `Foram registradas ${kpis.periodTransactionsCount} movimentações no período.`,
      severity: "info",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "stable-period",
      title: "Período estável",
      description: "Nenhum alerta financeiro relevante foi identificado neste período.",
      severity: "info",
    });
  }

  return insights;
}
