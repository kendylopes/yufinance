const skeletonCards = [
  "current-balance",
  "monthly-income",
  "monthly-expense",
  "monthly-result",
] as const;

export function DashboardSummarySkeleton() {
  return (
    <section
      aria-label="Carregando resumo financeiro"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {skeletonCards.map((card) => (
        <article key={card} className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="h-9 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
        </article>
      ))}
    </section>
  );
}
