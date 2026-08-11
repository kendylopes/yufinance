type BudgetProgressStatus = "ON_TRACK" | "NEAR_LIMIT" | "EXCEEDED";

type BudgetProgressCardProps = {
  categoryName: string;
  month: number;
  year: number;
  plannedAmount: string;
  spentAmount: string;
  remainingAmount: string;
  percentage: number;
  status: BudgetProgressStatus;
  currency?: string;
};

const statusLabels: Record<BudgetProgressStatus, string> = {
  ON_TRACK: "Dentro do orçamento",
  NEAR_LIMIT: "Próximo do limite",
  EXCEEDED: "Orçamento excedido",
};

export function BudgetProgressCard({
  categoryName,
  month,
  year,
  plannedAmount,
  spentAmount,
  remainingAmount,
  percentage,
  status,
  currency = "BRL",
}: BudgetProgressCardProps) {
  const normalizedPercentage = Math.max(0, Math.min(percentage, 100));

  return (
    <article className="space-y-5 rounded-xl border p-5">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">{categoryName}</h3>

          <p className="text-sm text-muted-foreground">{formatPeriod(month, year)}</p>
        </div>

        <span className="text-sm font-medium">{statusLabels[status]}</span>
      </header>

      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Planejado</dt>

          <dd className="font-medium">{formatCurrency(plannedAmount, currency)}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Gasto</dt>

          <dd className="font-medium">{formatCurrency(spentAmount, currency)}</dd>
        </div>

        <div className="space-y-1">
          <dt className="text-xs text-muted-foreground">Restante</dt>

          <dd className="font-medium">{formatCurrency(remainingAmount, currency)}</dd>
        </div>
      </dl>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Progresso</span>

          <span className="font-medium">{formatPercentage(percentage)}</span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={`Progresso do orçamento de ${categoryName}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={normalizedPercentage}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{
              width: `${normalizedPercentage}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}

function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(Number(value));
}

function formatPeriod(month: number, year: number) {
  const date = new Date(year, month - 1, 1);

  const formattedMonth = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(date);

  return `${capitalize(formattedMonth)} de ${year}`;
}

function formatPercentage(percentage: number) {
  return `${new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(percentage)}%`;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
