"use client";

import { useId } from "react";

import type { CategoryExpensesChartDto } from "../../../application/category-expenses-chart.dto";

type CategoryExpensesChartProps = {
  chart: CategoryExpensesChartDto;
  currency: string;
};

export function CategoryExpensesChart({ chart, currency }: CategoryExpensesChartProps) {
  const titleId = useId();

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  });

  return (
    <section aria-labelledby={titleId} className="rounded-xl border bg-card p-6">
      <header className="space-y-1">
        <h2 id={titleId} className="text-lg font-semibold">
          Despesas por categoria
        </h2>

        <p className="text-sm text-muted-foreground">
          Distribuição das despesas confirmadas no período.
        </p>
      </header>

      {chart.categories.length === 0 ? (
        <output className="mt-6 block text-sm text-muted-foreground">
          Nenhuma despesa encontrada para o período selecionado.
        </output>
      ) : (
        <div className="mt-8 space-y-6">
          {chart.categories.map((category) => (
            <CategoryRow
              key={category.categoryId}
              name={category.categoryName}
              amount={currencyFormatter.format(Number(category.amount))}
              percentage={category.percentage}
            />
          ))}
        </div>
      )}

      <footer className="mt-8 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total</span>

          <span className="text-sm font-semibold">
            {currencyFormatter.format(Number(chart.totalExpense))}
          </span>
        </div>
      </footer>
    </section>
  );
}

type CategoryRowProps = {
  name: string;
  amount: string;
  percentage: number;
};

function CategoryRow({ name, amount, percentage }: CategoryRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{name}</p>

          <p className="text-xs text-muted-foreground">{percentage.toFixed(2)}%</p>
        </div>

        <span className="text-sm font-semibold">{amount}</span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${name}: ${percentage.toFixed(2)}%`}
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-[width] duration-500"
          style={{
            width: percentage > 0 ? `${Math.max(percentage, 2)}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}
