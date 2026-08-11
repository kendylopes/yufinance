import { redirect } from "next/navigation";

import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";
import { listCategories } from "@/modules/categories/application/list-categories";
import { listFinancialAccounts } from "@/modules/financial-accounts/application/list-financial-accounts";
import { listTransactionsView } from "@/modules/transactions/application/list-transactions-view";
import { CreateTransactionForm } from "@/modules/transactions/presentation/create-transaction-form";
import { TransactionsTable } from "@/modules/transactions/presentation/transactions-table";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

export default async function TransactionsPage() {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const workspaceId = workspaceState.workspaceId;

  const [transactionsResult, financialAccountsResult, categoriesResult] = await Promise.all([
    listTransactionsView(workspaceId),
    listFinancialAccounts(workspaceId),
    listCategories(workspaceId),
  ]);

  const financialAccounts = financialAccountsResult.success
    ? financialAccountsResult.financialAccounts.map((account) => ({
        id: account.id,
        name: account.name,
      }))
    : [];

  const categories = categoriesResult.success
    ? categoriesResult.categories.map((category) => ({
        id: category.id,
        name: category.name,
        type: category.type,
      }))
    : [];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
      <PageHeader
        title="Transações"
        description="Registre e acompanhe as receitas e despesas do seu espaço financeiro."
      />

      <ResourceSection
        title="Movimentações"
        description={
          transactionsResult.success
            ? formatTransactionCount(transactionsResult.transactions.length)
            : undefined
        }
      >
        {!transactionsResult.success ? (
          <ErrorState message={transactionsResult.message} />
        ) : (
          <TransactionsTable
            workspaceId={workspaceId}
            transactions={transactionsResult.transactions}
          />
        )}
      </ResourceSection>

      <ResourceSection
        title="Nova transação"
        description="Escolha a conta, a categoria e informe os dados da movimentação."
      >
        <div className="space-y-4">
          {!financialAccountsResult.success && (
            <ErrorState message={financialAccountsResult.message} />
          )}

          {!categoriesResult.success && <ErrorState message={categoriesResult.message} />}

          <CreateTransactionForm
            workspaceId={workspaceId}
            financialAccounts={financialAccounts}
            categories={categories}
          />
        </div>
      </ResourceSection>
    </main>
  );
}

function formatTransactionCount(count: number) {
  return count === 1 ? "1 transação registrada" : `${count} transações registradas`;
}
