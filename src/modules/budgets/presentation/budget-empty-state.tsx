import Link from "next/link";

export function BudgetEmptyState() {
  return (
    <section className="rounded-xl border border-dashed p-8 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="space-y-2">
          <h2 className="font-semibold">Nenhum orçamento neste período</h2>

          <p className="text-sm text-muted-foreground">
            Crie um orçamento para começar a planejar seus gastos por categoria.
          </p>
        </div>

        <Link
          href="/dashboard/budgets/new"
          className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
        >
          Criar orçamento
        </Link>
      </div>
    </section>
  );
}
