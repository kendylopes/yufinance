import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";
import { getTransactionView } from "@/modules/transactions/application/get-transaction-view";
import { UpdateTransactionForm } from "@/modules/transactions/presentation/update-transaction-form";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

type EditTransactionPageProps = {
  params: Promise<{
    transactionId: string;
  }>;
};

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const { transactionId } = await params;

  const result = await getTransactionView({
    workspaceId: workspaceState.workspaceId,
    transactionId,
  });

  if (!result.success) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-6 py-10">
      <PageHeader
        title="Editar transação"
        description="Atualize os dados da movimentação financeira."
      />

      <ResourceSection
        title="Dados da transação"
        description="Atualize conta, categoria, tipo, valor, data e demais informações da movimentação."
      >
        <UpdateTransactionForm
          workspaceId={workspaceState.workspaceId}
          transaction={result.transaction}
          financialAccounts={result.financialAccounts}
          categories={result.categories}
        />
      </ResourceSection>

      <Link
        href="/dashboard/transactions"
        className="inline-flex text-sm underline-offset-4 hover:underline"
      >
        Voltar para transações
      </Link>
    </main>
  );
}
