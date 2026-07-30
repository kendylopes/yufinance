import { redirect } from "next/navigation";

import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";
import { OnboardingForm } from "@/modules/workspace/presentation/onboarding-form";

export default async function OnboardingPage() {
  const entryState = await getWorkspaceEntryState();

  if (entryState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (entryState.status === "READY") {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12">
      <section className="w-full space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Configuração inicial</p>

          <h1 className="text-2xl font-semibold">Crie seu espaço financeiro</h1>

          <p className="text-sm">
            Este espaço será usado para organizar suas contas, categorias, transações e demais
            informações financeiras.
          </p>
        </div>

        <OnboardingForm />
      </section>
    </main>
  );
}
