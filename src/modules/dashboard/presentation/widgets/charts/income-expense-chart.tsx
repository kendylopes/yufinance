"use client";

import { useId } from "react";

import type { IncomeExpenseChartDto } from "../../../application/income-expense-chart.dto";

type IncomeExpenseChartProps = {
  chart: IncomeExpenseChartDto;
  currency: string;
};

export function IncomeExpenseChart({ chart, currency }: IncomeExpenseChartProps) {
  const titleId = useId();

  const income = Number(chart.income);
  const expense = Number(chart.expense);
  const highestValue = Math.max(income, expense, 1);

  const incomePercentage = (income / highestValue) * 100;
  const expensePercentage = (expense / highestValue) * 100;

  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  });

  return (
    <section aria-labelledby={titleId} className="rounded-xl border bg-card p-6">
      <header className="space-y-1">
        <h2 id={titleId} className="text-lg font-semibold">
          Receitas e despesas
        </h2>

        <p className="text-sm text-muted-foreground">
          Comparação das movimentações confirmadas no período.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        <ChartBar
          label="Receitas"
          value={income}
          formattedValue={currencyFormatter.format(income)}
          percentage={incomePercentage}
          indicatorClassName="bg-green-600"
        />

        <ChartBar
          label="Despesas"
          value={expense}
          formattedValue={currencyFormatter.format(expense)}
          percentage={expensePercentage}
          indicatorClassName="bg-red-600"
        />
      </div>

      {income === 0 && expense === 0 && (
        <output className="mt-6 block text-sm text-muted-foreground">
          Não há movimentações confirmadas no período selecionado.
        </output>
      )}
    </section>
  );
}

type ChartBarProps = {
  label: string;
  value: number;
  formattedValue: string;
  percentage: number;
  indicatorClassName: string;
};

function ChartBar({ label, value, formattedValue, percentage, indicatorClassName }: ChartBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">{label}</span>

        <span className="text-sm font-semibold">{formattedValue}</span>
      </div>

      <div
        className="h-3 overflow-hidden rounded-full bg-muted"
        role="img"
        aria-label={`${label}: ${formattedValue}`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${indicatorClassName}`}
          style={{
            width: value > 0 ? `${Math.max(percentage, 2)}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}
