import { DashboardSummarySkeleton } from "@/modules/dashboard/presentation/dashboard-summary-skeleton";

function SectionSkeleton() {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 w-full animate-pulse rounded bg-muted" />
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8">
      <header className="space-y-2">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="h-5 w-80 animate-pulse rounded bg-muted" />
      </header>

      <DashboardSummarySkeleton />

      <SectionSkeleton />

      <SectionSkeleton />

      <SectionSkeleton />

      <SectionSkeleton />

      <SectionSkeleton />
    </main>
  );
}
