import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";

export default function EditTransactionLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-6 py-10">
      <PageHeader
        title="Editar transação"
        description="Atualize os dados da movimentação financeira."
      />

      <ResourceSection
        title="Dados da transação"
        description="Carregando as informações necessárias para edição."
      >
        <LoadingState label="Carregando transação..." />
      </ResourceSection>
    </main>
  );
}
