import Link from "next/link";
import { redirect } from "next/navigation";

import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";
import { listArchivedBudgets } from "@/modules/budgets/application/list-archived-budgets";
import { listBudgets } from "@/modules/budgets/application/list-budgets";
import { ArchiveBudgetButton } from "@/modules/budgets/presentation/archive-budget-button";
import { BudgetProgressCard } from "@/modules/budgets/presentation/budget-progress-card";
import { CreateBudgetForm } from "@/modules/budgets/presentation/create-budget-form";
import { RestoreBudgetButton } from "@/modules/budgets/presentation/restore-budget-button";
import { listCategories } from "@/modules/categories/application/list-categories";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

export default async function BudgetsPage() {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const workspaceId = workspaceState.workspaceId;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [budgetsResult, archivedBudgetsResult, categoriesResult] = await Promise.all([
    listBudgets({
      workspaceId,
      month,
      year,
    }),
    listArchivedBudgets(workspaceId),
    listCategories(workspaceId),
  ]);

  const categories = categoriesResult.success
    ? categoriesResult.categories.filter((category) => category.type === "EXPENSE")
    : [];

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-6 py-10">
      <PageHeader
        title="Orçamentos"
        description="Planeje seus gastos por categoria e acompanhe o realizado ao longo do mês."
      />

      <ResourceSection
        title={formatPeriod(month, year)}
        description={
          budgetsResult.success ? formatBudgetCount(budgetsResult.budgets.length) : undefined
        }
      >
        {!budgetsResult.success ? (
          <ErrorState message={budgetsResult.message} />
        ) : budgetsResult.budgets.length === 0 ? (
          <EmptyState
            title="Nenhum orçamento neste período"
            description="Crie um orçamento para começar a acompanhar seus gastos planejados e realizados."
          />
        ) : (
          <div className="space-y-5">
            {budgetsResult.budgets.map((budget) => (
              <div key={budget.id} className="space-y-3">
                <BudgetProgressCard
                  categoryName={budget.categoryName}
                  month={budget.month}
                  year={budget.year}
                  plannedAmount={budget.plannedAmount}
                  spentAmount={budget.spentAmount}
                  remainingAmount={budget.remainingAmount}
                  percentage={budget.percentage}
                  status={budget.status}
                />

                <div className="flex flex-wrap items-center gap-3 px-1">
                  <Link
                    href={`/dashboard/budgets/${budget.id}/edit`}
                    className="text-sm underline underline-offset-4"
                  >
                    Editar
                  </Link>

                  <ArchiveBudgetButton
                    workspaceId={workspaceId}
                    budgetId={budget.id}
                    categoryName={budget.categoryName}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </ResourceSection>

      <ResourceSection
        title="Novo orçamento"
        description="Escolha uma categoria de despesa e defina quanto pretende gastar no período."
      >
        {!categoriesResult.success ? (
          <ErrorState message={categoriesResult.message} />
        ) : categories.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria de despesa disponível"
            description="Cadastre uma categoria de despesa antes de criar um orçamento."
          />
        ) : (
          <CreateBudgetForm workspaceId={workspaceId} categories={categories} />
        )}
      </ResourceSection>

      <ResourceSection
        title="Orçamentos arquivados"
        description={
          archivedBudgetsResult.success
            ? formatArchivedBudgetCount(archivedBudgetsResult.budgets.length)
            : undefined
        }
      >
        {!archivedBudgetsResult.success ? (
          <ErrorState message={archivedBudgetsResult.message} />
        ) : archivedBudgetsResult.budgets.length === 0 ? (
          <EmptyState
            title="Nenhum orçamento arquivado"
            description="Os orçamentos arquivados aparecerão aqui e poderão ser restaurados."
          />
        ) : (
          <div className="space-y-3">
            {archivedBudgetsResult.budgets.map((budget) => (
              <article key={budget.id} className="rounded-xl border p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{budget.categoryName}</h3>

                      <p className="text-sm text-muted-foreground">
                        {formatPeriod(budget.month, budget.year)}
                      </p>
                    </div>

                    <RestoreBudgetButton
                      workspaceId={workspaceId}
                      budgetId={budget.id}
                      categoryName={budget.categoryName}
                    />
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground">Planejado</p>

                    <p className="font-semibold">{formatCurrency(budget.plannedAmount)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </ResourceSection>
    </main>
  );
}

function formatPeriod(month: number, year: number) {
  const date = new Date(year, month - 1, 1);

  const formattedMonth = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(date);

  return `${capitalize(formattedMonth)} de ${year}`;
}

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

function formatBudgetCount(count: number) {
  return count === 1 ? "1 orçamento no período" : `${count} orçamentos no período`;
}

function formatArchivedBudgetCount(count: number) {
  return count === 1 ? "1 orçamento arquivado" : `${count} orçamentos arquivados`;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
