import { redirect } from "next/navigation";

import { dashboardPeriodSchema } from "@/modules/dashboard/application/dashboard-period.schema";
import { getCategoryExpensesChart } from "@/modules/dashboard/application/get-category-expenses-chart";
import { getDashboardInsights } from "@/modules/dashboard/application/get-dashboard-insights";
import { getDashboardKpis } from "@/modules/dashboard/application/get-dashboard-kpis";
import { getDashboardSummary } from "@/modules/dashboard/application/get-dashboard-summary";
import { getIncomeExpenseChart } from "@/modules/dashboard/application/get-income-expense-chart";
import { getMonthlyEvolutionChart } from "@/modules/dashboard/application/get-monthly-evolution-chart";
import { listDashboardPeriodOptions } from "@/modules/dashboard/application/list-dashboard-period-options";
import { listRecentTransactions } from "@/modules/dashboard/application/list-recent-transactions";
import { DashboardHeader } from "@/modules/dashboard/presentation/dashboard-header";
import { DashboardSummaryCards } from "@/modules/dashboard/presentation/dashboard-summary-cards";
import { RecentTransactionsList } from "@/modules/dashboard/presentation/recent-transactions-list";
import { DashboardKpis } from "@/modules/dashboard/presentation/widgets/cards/dashboard-kpis";
import { CategoryExpensesChart } from "@/modules/dashboard/presentation/widgets/charts/category-expenses-chart";
import { IncomeExpenseChart } from "@/modules/dashboard/presentation/widgets/charts/income-expense-chart";
import { MonthlyEvolutionChart } from "@/modules/dashboard/presentation/widgets/charts/monthly-evolution-chart";
import { PeriodFilter } from "@/modules/dashboard/presentation/widgets/filters/period-filter";
import { DashboardInsights } from "@/modules/dashboard/presentation/widgets/insights/dashboard-insights";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

type DashboardPageProps = {
  searchParams: Promise<{
    period?: string | string[];
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const resolvedSearchParams = await searchParams;

  const requestedPeriod =
    typeof resolvedSearchParams.period === "string" ? resolvedSearchParams.period : undefined;

  const periodResult = dashboardPeriodSchema.safeParse({
    period: requestedPeriod,
  });

  const period = periodResult.success ? periodResult.data.period : "CURRENT_MONTH";

  const workspaceId = workspaceState.workspaceId;

  const [
    summaryResult,
    recentTransactionsResult,
    kpisResult,
    incomeExpenseResult,
    monthlyEvolutionResult,
    categoryExpensesResult,
  ] = await Promise.all([
    getDashboardSummary({
      workspaceId,
      period,
    }),

    listRecentTransactions({
      workspaceId,
      period,
      limit: 5,
    }),

    getDashboardKpis({
      workspaceId,
      period,
    }),

    getIncomeExpenseChart({
      workspaceId,
      period,
    }),

    getMonthlyEvolutionChart({
      workspaceId,
      period,
    }),

    getCategoryExpensesChart({
      workspaceId,
      period,
    }),
  ]);

  const periodOptions = listDashboardPeriodOptions();

  const currency = summaryResult.success ? summaryResult.summary.currency : "BRL";

  const insights =
    summaryResult.success &&
    kpisResult.success &&
    incomeExpenseResult.success &&
    categoryExpensesResult.success
      ? getDashboardInsights({
          summary: summaryResult.summary,
          kpis: kpisResult.kpis,
          incomeExpense: incomeExpenseResult.chart,
          categoryExpenses: categoryExpensesResult.chart,
        })
      : [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
      <DashboardHeader periodFilter={<PeriodFilter value={period} options={periodOptions} />} />

      {!summaryResult.success ? (
        <DashboardError message={summaryResult.message} />
      ) : (
        <DashboardSummaryCards summary={summaryResult.summary} />
      )}

      {!kpisResult.success ? (
        <DashboardError message={kpisResult.message} />
      ) : (
        <DashboardKpis kpis={kpisResult.kpis} />
      )}

      {!incomeExpenseResult.success ? (
        <DashboardError message={incomeExpenseResult.message} />
      ) : (
        <IncomeExpenseChart chart={incomeExpenseResult.chart} currency={currency} />
      )}

      {!monthlyEvolutionResult.success ? (
        <DashboardError message={monthlyEvolutionResult.message} />
      ) : (
        <MonthlyEvolutionChart chart={monthlyEvolutionResult.chart} currency={currency} />
      )}

      {!categoryExpensesResult.success ? (
        <DashboardError message={categoryExpensesResult.message} />
      ) : (
        <CategoryExpensesChart chart={categoryExpensesResult.chart} currency={currency} />
      )}

      {insights.length > 0 && <DashboardInsights insights={insights} />}

      {!recentTransactionsResult.success ? (
        <DashboardError message={recentTransactionsResult.message} />
      ) : (
        <RecentTransactionsList
          transactions={recentTransactionsResult.transactions}
          currency={currency}
        />
      )}
    </main>
  );
}

type DashboardErrorProps = {
  message: string;
};

function DashboardError({ message }: DashboardErrorProps) {
  return (
    <section className="rounded-xl border p-6">
      <p className="text-sm" role="alert">
        {message}
      </p>
    </section>
  );
}
