import Link from "next/link";
import { redirect } from "next/navigation";

import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";
import { listFinancialAccounts } from "@/modules/financial-accounts/application/list-financial-accounts";
import { CreateFinancialAccountForm } from "@/modules/financial-accounts/presentation/create-financial-account-form";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

const financialAccountTypeLabels = {
  CHECKING: "Conta corrente",
  SAVINGS: "Poupança",
  DIGITAL: "Conta digital",
  WALLET: "Carteira",
  CASH: "Dinheiro em espécie",
} as const;

export default async function FinancialAccountsPage() {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/sign-in");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const workspaceId = workspaceState.workspaceId;

  const result = await listFinancialAccounts(workspaceId);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10">
      <PageHeader
        title="Contas financeiras"
        description="Gerencie as contas que fazem parte da sua vida financeira."
      />

      <ResourceSection
        title="Suas contas"
        description={
          result.success ? formatAccountCount(result.financialAccounts.length) : undefined
        }
      >
        {!result.success ? (
          <ErrorState message={result.message} />
        ) : result.financialAccounts.length === 0 ? (
          <EmptyState
            title="Nenhuma conta financeira cadastrada"
            description="Crie sua primeira conta para começar a organizar seus saldos e movimentações."
          />
        ) : (
          <div className="space-y-3">
            {result.financialAccounts.map((account) => (
              <article key={account.id} className="rounded-xl border p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{account.name}</h3>

                      <p className="text-sm text-muted-foreground">
                        {financialAccountTypeLabels[account.type]}
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/accounts/${account.id}/edit`}
                      className="text-sm underline underline-offset-4"
                    >
                      Editar
                    </Link>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground">Saldo inicial</p>

                    <p className="font-semibold">
                      {formatCurrency(account.initialBalance, account.currency)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </ResourceSection>

      <ResourceSection
        title="Nova conta"
        description="Informe os dados da conta e o saldo existente atualmente."
      >
        <CreateFinancialAccountForm workspaceId={workspaceId} />
      </ResourceSection>
    </main>
  );
}

function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(Number(value));
}

function formatAccountCount(count: number) {
  return count === 1 ? "1 conta cadastrada" : `${count} contas cadastradas`;
}
