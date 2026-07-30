import Link from "next/link";
import { redirect } from "next/navigation";

import { listArchivedFinancialAccounts } from "@/modules/financial-accounts/application/list-archived-financial-accounts";
import { listFinancialAccounts } from "@/modules/financial-accounts/application/list-financial-accounts";
import { ArchiveFinancialAccountButton } from "@/modules/financial-accounts/presentation/archive-financial-account-button";
import { CreateFinancialAccountForm } from "@/modules/financial-accounts/presentation/create-financial-account-form";
import { RestoreFinancialAccountButton } from "@/modules/financial-accounts/presentation/restore-financial-account-button";
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

  const [activeAccountsResult, archivedAccountsResult] = await Promise.all([
    listFinancialAccounts(workspaceId),
    listArchivedFinancialAccounts(workspaceId),
  ]);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Contas financeiras</h1>

        <p className="text-sm">Gerencie as contas que fazem parte da sua vida financeira.</p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Suas contas</h2>

          {activeAccountsResult.success && (
            <p className="text-sm">
              {formatAccountCount(activeAccountsResult.financialAccounts.length)}
            </p>
          )}
        </div>

        {!activeAccountsResult.success && (
          <p className="text-sm" role="alert">
            {activeAccountsResult.message}
          </p>
        )}

        {activeAccountsResult.success && activeAccountsResult.financialAccounts.length === 0 && (
          <div className="rounded-xl border p-6">
            <p className="font-medium">Nenhuma conta financeira cadastrada.</p>

            <p className="mt-1 text-sm">Crie sua primeira conta usando o formulário abaixo.</p>
          </div>
        )}

        {activeAccountsResult.success && activeAccountsResult.financialAccounts.length > 0 && (
          <div className="space-y-3">
            {activeAccountsResult.financialAccounts.map((account) => (
              <article key={account.id} className="rounded-xl border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{account.name}</h3>

                      <p className="text-sm">{financialAccountTypeLabels[account.type]}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/accounts/${account.id}/edit`}
                        className="text-sm underline"
                      >
                        Editar
                      </Link>

                      <ArchiveFinancialAccountButton
                        workspaceId={workspaceId}
                        financialAccountId={account.id}
                        financialAccountName={account.name}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs">Saldo inicial</p>

                    <p className="font-semibold">
                      {formatCurrency(account.initialBalance, account.currency)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border p-6">
        <div className="mb-6 space-y-1">
          <h2 className="text-lg font-semibold">Nova conta</h2>

          <p className="text-sm">Informe os dados da conta e o saldo existente atualmente.</p>
        </div>

        <CreateFinancialAccountForm workspaceId={workspaceId} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Contas arquivadas</h2>

          {archivedAccountsResult.success && (
            <p className="text-sm">
              {formatArchivedAccountCount(archivedAccountsResult.financialAccounts.length)}
            </p>
          )}
        </div>

        {!archivedAccountsResult.success && (
          <p className="text-sm" role="alert">
            {archivedAccountsResult.message}
          </p>
        )}

        {archivedAccountsResult.success &&
          archivedAccountsResult.financialAccounts.length === 0 && (
            <p className="text-sm">Nenhuma conta arquivada.</p>
          )}

        {archivedAccountsResult.success && archivedAccountsResult.financialAccounts.length > 0 && (
          <div className="space-y-3">
            {archivedAccountsResult.financialAccounts.map((account) => (
              <article key={account.id} className="rounded-xl border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{account.name}</h3>

                      <p className="text-sm">{financialAccountTypeLabels[account.type]}</p>
                    </div>

                    <RestoreFinancialAccountButton
                      workspaceId={workspaceId}
                      financialAccountId={account.id}
                      financialAccountName={account.name}
                    />
                  </div>

                  <div className="text-right">
                    <p className="text-xs">Saldo inicial</p>

                    <p className="font-semibold">
                      {formatCurrency(account.initialBalance, account.currency)}
                    </p>

                    {account.archivedAt && (
                      <p className="mt-1 text-xs">Arquivada em {formatDate(account.archivedAt)}</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(Number(value));
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(value);
}

function formatAccountCount(count: number) {
  if (count === 1) {
    return "1 conta cadastrada";
  }

  return `${count} contas cadastradas`;
}

function formatArchivedAccountCount(count: number) {
  if (count === 1) {
    return "1 conta arquivada";
  }

  return `${count} contas arquivadas`;
}
