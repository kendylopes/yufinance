// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./cancel-transaction-button", () => ({
  CancelTransactionButton: ({ transactionId }: { transactionId: string }) => (
    <button type="button">Cancelar {transactionId}</button>
  ),
}));

vi.mock("./restore-transaction-button", () => ({
  RestoreTransactionButton: ({ transactionId }: { transactionId: string }) => (
    <button type="button">Restaurar {transactionId}</button>
  ),
}));

import { TransactionsTable } from "./transactions-table";

const workspaceId = "550e8400-e29b-41d4-a716-446655440000";

const activeTransactionId = "660e8400-e29b-41d4-a716-446655440000";

const canceledTransactionId = "770e8400-e29b-41d4-a716-446655440000";

describe("TransactionsTable", () => {
  afterEach(() => {
    cleanup();
  });

  it("exibe EmptyState quando não há transações", () => {
    render(<TransactionsTable workspaceId={workspaceId} transactions={[]} />);

    expect(screen.getByText("Nenhuma transação encontrada")).toBeTruthy();

    expect(screen.getByText("As receitas e despesas registradas aparecerão aqui.")).toBeTruthy();
  });

  it("renderiza os dados das transações", () => {
    renderTable();

    expect(screen.getByText("Supermercado")).toBeTruthy();

    expect(screen.getByText("Alimentação")).toBeTruthy();

    expect(screen.getByText("Conta principal")).toBeTruthy();

    expect(screen.getByText("Salário")).toBeTruthy();

    expect(screen.getByText("Conta salário")).toBeTruthy();
  });

  it("exibe status ativo e ação de cancelamento para transação ativa", () => {
    renderTable();

    expect(screen.getByText("Ativa")).toBeTruthy();

    const editLink = screen.getByRole("link", {
      name: "Editar",
    }) as HTMLAnchorElement;

    expect(editLink.getAttribute("href")).toBe(
      `/dashboard/transactions/${activeTransactionId}/edit?workspaceId=${workspaceId}`,
    );

    expect(
      screen.getByRole("button", {
        name: `Cancelar ${activeTransactionId}`,
      }),
    ).toBeTruthy();
  });

  it("exibe status cancelado e ação de restauração para transação cancelada", () => {
    renderTable();

    expect(screen.getByText("Cancelada")).toBeTruthy();

    expect(
      screen.getByRole("button", {
        name: `Restaurar ${canceledTransactionId}`,
      }),
    ).toBeTruthy();
  });

  it("não oferece edição para transação cancelada", () => {
    renderTable();

    const editLinks = screen.getAllByRole("link", {
      name: "Editar",
    });

    expect(editLinks).toHaveLength(1);

    const editLink = editLinks[0] as HTMLAnchorElement;

    expect(editLink.getAttribute("href")).toBe(
      `/dashboard/transactions/${activeTransactionId}/edit?workspaceId=${workspaceId}`,
    );
  });

  it("formata receita como positiva e despesa como negativa", () => {
    renderTable();

    expect(screen.getByText("-R$ 150,50")).toBeTruthy();

    expect(screen.getByText("R$ 3.500,00")).toBeTruthy();
  });
});

function renderTable() {
  render(
    <TransactionsTable
      workspaceId={workspaceId}
      transactions={[
        {
          id: activeTransactionId,
          description: "Supermercado",
          type: "EXPENSE",
          amount: "150.5000",
          occurredAt: new Date("2026-08-10T12:00:00.000Z"),
          canceledAt: null,
          categoryName: "Alimentação",
          financialAccountName: "Conta principal",
        },
        {
          id: canceledTransactionId,
          description: "Pagamento mensal",
          type: "INCOME",
          amount: "3500.0000",
          occurredAt: new Date("2026-08-05T12:00:00.000Z"),
          canceledAt: new Date("2026-08-06T12:00:00.000Z"),
          categoryName: "Salário",
          financialAccountName: "Conta salário",
        },
      ]}
    />,
  );
}
