import Link from "next/link";

import type { RecentTransactionDto } from "../application/recent-transaction.dto";

type RecentTransactionsListProps = {
  transactions: RecentTransactionDto[];
  currency: string;
};

export function RecentTransactionsList({ transactions, currency }: RecentTransactionsListProps) {
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  });

  const dateFormatter = new Intl.DateTimeFormat("pt-BR");

  if (transactions.length === 0) {
    return (
      <section className="rounded-xl border p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Últimas transações</h2>

          <p className="text-sm text-muted-foreground">
            Nenhuma transação registrada até o momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Últimas transações</h2>

          <p className="text-sm text-muted-foreground">Movimentações financeiras mais recentes.</p>
        </div>

        <Link
          href="/dashboard/transactions"
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          Ver todas
        </Link>
      </header>

      <div className="divide-y">
        {transactions.map((transaction) => (
          <article
            key={transaction.id}
            className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-medium">{transaction.description}</h3>

                {transaction.canceled && (
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    Cancelada
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground">
                {transaction.category} · {transaction.financialAccount}
              </p>
            </div>

            <div className="flex items-center justify-between gap-6 sm:justify-end">
              <time
                className="text-sm text-muted-foreground"
                dateTime={transaction.occurredAt.toISOString()}
              >
                {dateFormatter.format(transaction.occurredAt)}
              </time>

              <p
                className={`min-w-28 text-right font-semibold ${
                  transaction.canceled
                    ? "text-muted-foreground line-through"
                    : transaction.type === "INCOME"
                      ? "text-green-600"
                      : "text-red-600"
                }`}
              >
                {transaction.type === "EXPENSE" ? "- " : "+ "}
                {currencyFormatter.format(Number(transaction.amount))}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
