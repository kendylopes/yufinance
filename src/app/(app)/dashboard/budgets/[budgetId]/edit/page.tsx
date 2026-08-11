import Link from "next/link";
import { redirect } from "next/navigation";

import { ErrorState } from "@/components/feedback/error-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";
import { getBudget } from "@/modules/budgets/application/get-budget";
import { UpdateBudgetForm } from "@/modules/budgets/presentation/update-budget-form";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

type EditBudgetPageProps = {
  params: Promise<{
    budgetId: string;
  }>;
};

export default async function EditBudgetPage({ params }: EditBudgetPageProps) {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const { budgetId } = await params;
  const workspaceId = workspaceState.workspaceId;

  const result = await getBudget({
    workspaceId,
    budgetId,
  });

  if (!result.success) {
    return (
      <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10">
        <PageHeader title="Editar orçamento" description="Atualize os dados do orçamento." />

        <ErrorState message={result.message} />

        <Link
          href="/dashboard/budgets"
          className="inline-block text-sm underline underline-offset-4"
        >
          Voltar para orçamentos
        </Link>
      </main>
    );
  }

  const { budget } = result;

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10">
      <PageHeader
        title="Editar orçamento"
        description="Atualize o período ou o valor planejado deste orçamento."
      />

      <ResourceSection
        title="Dados do orçamento"
        description="A categoria permanece vinculada ao orçamento original."
      >
        <UpdateBudgetForm
          workspaceId={workspaceId}
          budgetId={budget.id}
          defaultValues={{
            plannedAmount: Number(budget.plannedAmount),
            month: budget.month,
            year: budget.year,
          }}
        />
      </ResourceSection>

      <Link href="/dashboard/budgets" className="inline-block text-sm underline underline-offset-4">
        Voltar para orçamentos
      </Link>
    </main>
  );
}
