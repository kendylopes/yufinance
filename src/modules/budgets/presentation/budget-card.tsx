import Link from "next/link";

import type { BudgetDto } from "../application/budget.dto";

type BudgetCardProps = {
  budget: BudgetDto;
};

export function BudgetCard({ budget }: BudgetCardProps) {
  const planned = Number(budget.plannedAmount);
  const spent = Number(budget.spentAmount);
  const remaining = Number(budget.remainingAmount);

  return (
    <article className="space-y-5 rounded-xl border p-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold">{budget.categoryName}</h2>

          <p className="text-sm text-muted-foreground">{formatPeriod(budget.month, budget.year)}</p>
        </div>

        <BudgetStatusBadge status={budget.status} />
      </header>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span>Progresso</span>

          <span className="font-medium">{budget.percentage.toFixed(2)}%</span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          aria-label={`Progresso do orçamento: ${budget.percentage.toFixed(2)}%`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.min(budget.percentage, 100)}
        >
          <div
            className="h-full bg-foreground transition-[width]"
            style={{
              width: `${Math.min(budget.percentage, 100)}%`,
            }}
          />
        </div>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        <BudgetMetric label="Planejado" value={formatCurrency(planned)} />

        <BudgetMetric label="Gasto" value={formatCurrency(spent)} />

        <BudgetMetric label="Restante" value={formatCurrency(remaining)} />
      </dl>

      <div className="flex justify-end">
        <Link
          href={`/dashboard/budgets/${budget.id}/edit`}
          className="rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Editar
        </Link>
      </div>
    </article>
  );
}

type BudgetMetricProps = {
  label: string;
  value: string;
};

function BudgetMetric({ label, value }: BudgetMetricProps) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>

      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

type BudgetStatusBadgeProps = {
  status: BudgetDto["status"];
};

function BudgetStatusBadge({ status }: BudgetStatusBadgeProps) {
  const label = {
    ON_TRACK: "Dentro do orçamento",
    NEAR_LIMIT: "Próximo do limite",
    EXCEEDED: "Orçamento excedido",
  }[status];

  return <span className="w-fit rounded-full border px-2.5 py-1 text-xs font-medium">{label}</span>;
}

function formatPeriod(month: number, year: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
