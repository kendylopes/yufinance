"use client";

import { useId } from "react";

import type { MonthlyEvolutionChartDto } from "../../../application/monthly-evolution-chart.dto";

type MonthlyEvolutionChartProps = {
  chart: MonthlyEvolutionChartDto;
  currency: string;
};

export function MonthlyEvolutionChart({ chart, currency }: MonthlyEvolutionChartProps) {
  const titleId = useId();

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  });

  const highestValue = Math.max(
    ...chart.flatMap((point) => [Number(point.income), Number(point.expense)]),
    1,
  );

  return (
    <section aria-labelledby={titleId} className="rounded-xl border bg-card p-6">
      <header className="space-y-1">
        <h2 id={titleId} className="text-lg font-semibold">
          Evolução mensal
        </h2>

        <p className="text-sm text-muted-foreground">
          Comparação mensal entre receitas e despesas.
        </p>
      </header>

      {chart.length === 0 ? (
        <output className="mt-6 block text-sm text-muted-foreground">
          Não há movimentações suficientes para exibir a evolução mensal.
        </output>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-sm bg-green-600" />

              <span>Receitas</span>
            </div>

            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="size-3 rounded-sm bg-red-600" />

              <span>Despesas</span>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <div className="flex min-w-max items-end gap-6">
              {chart.map((point) => {
                const income = Number(point.income);
                const expense = Number(point.expense);

                return (
                  <article
                    key={point.month}
                    className="flex w-24 shrink-0 flex-col items-center gap-3"
                  >
                    <div className="flex h-56 items-end gap-2">
                      <ChartColumn
                        label={`${point.month} — Receitas`}
                        formattedValue={currencyFormatter.format(income)}
                        percentage={(income / highestValue) * 100}
                        className="bg-green-600"
                      />

                      <ChartColumn
                        label={`${point.month} — Despesas`}
                        formattedValue={currencyFormatter.format(expense)}
                        percentage={(expense / highestValue) * 100}
                        className="bg-red-600"
                      />
                    </div>

                    <p className="text-sm font-medium">{point.month}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

type ChartColumnProps = {
  label: string;
  formattedValue: string;
  percentage: number;
  className: string;
};

function ChartColumn({ label, formattedValue, percentage, className }: ChartColumnProps) {
  const height = percentage > 0 ? `${Math.max(percentage, 3)}%` : "0%";

  return (
    <div
      aria-label={`${label}: ${formattedValue}`}
      className="flex h-full w-7 items-end"
      role="img"
      title={formattedValue}
    >
      <div
        className={`w-full rounded-t transition-[height] duration-500 ${className}`}
        style={{ height }}
      />
    </div>
  );
}
