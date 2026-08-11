import type { DashboardSummaryDto } from "../application/dashboard-summary.dto";
import { DashboardCard } from "./dashboard-card";

type DashboardSummaryCardsProps = {
  summary: DashboardSummaryDto;
};

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: summary.currency,
  });

  return (
    <section aria-label="Resumo financeiro" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Saldo atual"
        value={currencyFormatter.format(Number(summary.currentBalance))}
        subtitle={`${summary.activeAccountsCount} ${formatAccountsLabel(
          summary.activeAccountsCount,
        )}`}
      />

      <DashboardCard
        title="Receitas do mês"
        value={currencyFormatter.format(Number(summary.monthlyIncome))}
        subtitle="Entradas confirmadas no período"
      />

      <DashboardCard
        title="Despesas do mês"
        value={currencyFormatter.format(Number(summary.monthlyExpense))}
        subtitle="Saídas confirmadas no período"
      />

      <DashboardCard
        title="Resultado do mês"
        value={currencyFormatter.format(Number(summary.monthlyResult))}
        subtitle={`${summary.monthlyTransactionsCount} ${formatTransactionsLabel(
          summary.monthlyTransactionsCount,
        )}`}
      />
    </section>
  );
}

function formatAccountsLabel(count: number) {
  return count === 1 ? "conta ativa" : "contas ativas";
}

function formatTransactionsLabel(count: number) {
  return count === 1 ? "transação no mês" : "transações no mês";
}
