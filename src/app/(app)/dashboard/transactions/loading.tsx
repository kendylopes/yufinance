import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";

export default function TransactionsLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
      <PageHeader
        title="Transações"
        description="Registre e acompanhe as receitas e despesas do seu espaço financeiro."
      />

      <ResourceSection
        title="Carregando movimentações"
        description="Buscando suas transações e dados financeiros."
      >
        <LoadingState label="Carregando transações..." />
      </ResourceSection>
    </main>
  );
}
