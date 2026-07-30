import { redirect } from "next/navigation";

import { getFinancialAccount } from "@/modules/financial-accounts/application/get-financial-account";
import { UpdateFinancialAccountForm } from "@/modules/financial-accounts/presentation/update-financial-account-form";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

type EditFinancialAccountPageProps = {
  params: Promise<{
    financialAccountId: string;
  }>;
};

export default async function EditFinancialAccountPage({ params }: EditFinancialAccountPageProps) {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const { financialAccountId } = await params;

  const result = await getFinancialAccount({
    workspaceId: workspaceState.workspaceId,
    financialAccountId,
  });

  if (!result.success) {
    redirect("/dashboard/accounts");
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Editar conta financeira</h1>

        <p className="text-sm">Atualize o nome ou o tipo da conta.</p>
      </header>

      <section className="rounded-xl border p-6">
        <UpdateFinancialAccountForm
          workspaceId={workspaceState.workspaceId}
          financialAccountId={result.financialAccount.id}
          defaultValues={{
            name: result.financialAccount.name,
            type: result.financialAccount.type,
          }}
        />
      </section>
    </main>
  );
}
