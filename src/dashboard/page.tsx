import { redirect } from "next/navigation";

import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

export default async function DashboardPage() {
  const entryState = await getWorkspaceEntryState();

  if (entryState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (entryState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <section className="space-y-4">
        <p className="text-sm font-medium">YuFinance</p>

        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <p className="text-sm">
          Seu espaço financeiro está configurado e pronto para receber os próximos módulos.
        </p>

        <p className="text-xs">Workspace atual: {entryState.workspaceId}</p>
      </section>
    </main>
  );
}
