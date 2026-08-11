"use client";

import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";

import type { TransactionViewDto } from "../application/dto";
import { CancelTransactionButton } from "./cancel-transaction-button";
import { RestoreTransactionButton } from "./restore-transaction-button";

type TransactionsTableProps = {
  workspaceId: string;
  transactions: TransactionViewDto[];
};

export function TransactionsTable({ workspaceId, transactions }: TransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="Nenhuma transação encontrada"
        description="As receitas e despesas registradas aparecerão aqui."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/40">
            <th className="px-4 py-3 text-left text-sm font-semibold">Descrição</th>

            <th className="px-4 py-3 text-left text-sm font-semibold">Categoria</th>

            <th className="px-4 py-3 text-left text-sm font-semibold">Conta</th>

            <th className="px-4 py-3 text-right text-sm font-semibold">Valor</th>

            <th className="px-4 py-3 text-center text-sm font-semibold">Data</th>

            <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>

            <th className="px-4 py-3 text-center text-sm font-semibold">Ações</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b last:border-0">
              <td className="px-4 py-3">{transaction.description}</td>

              <td className="px-4 py-3">{transaction.categoryName}</td>

              <td className="px-4 py-3">{transaction.financialAccountName}</td>

              <td
                className={`px-4 py-3 text-right font-medium ${
                  transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(transaction.amount, transaction.type)}
              </td>

              <td className="px-4 py-3 text-center">{formatDate(transaction.occurredAt)}</td>

              <td className="px-4 py-3 text-center">
                {transaction.canceledAt ? (
                  <span className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                    Cancelada
                  </span>
                ) : (
                  <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    Ativa
                  </span>
                )}
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-wrap justify-center gap-2">
                  {!transaction.canceledAt && (
                    <Link
                      href={`/dashboard/transactions/${transaction.id}/edit?workspaceId=${workspaceId}`}
                      className="rounded-md border px-3 py-1 text-sm transition hover:bg-muted"
                    >
                      Editar
                    </Link>
                  )}

                  {transaction.canceledAt ? (
                    <RestoreTransactionButton
                      workspaceId={workspaceId}
                      transactionId={transaction.id}
                    />
                  ) : (
                    <CancelTransactionButton
                      workspaceId={workspaceId}
                      transactionId={transaction.id}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCurrency(value: string, type: "INCOME" | "EXPENSE") {
  const amount = Number(value);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(type === "EXPENSE" ? -amount : amount);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}
