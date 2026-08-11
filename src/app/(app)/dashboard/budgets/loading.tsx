import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";

export default function BudgetsLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-6 py-10">
      <PageHeader
        title="Orçamentos"
        description="Planeje seus gastos por categoria e acompanhe o realizado ao longo do mês."
      />

      <ResourceSection
        title="Carregando período"
        description="Buscando seus orçamentos e dados financeiros."
      >
        <LoadingState label="Carregando orçamentos..." />
      </ResourceSection>
    </main>
  );
}
