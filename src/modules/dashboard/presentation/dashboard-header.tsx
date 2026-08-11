import type { ReactNode } from "react";

type DashboardHeaderProps = {
  periodFilter: ReactNode;
};

export function DashboardHeader({ periodFilter }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">Acompanhe o resumo do seu espaço financeiro.</p>
      </div>

      <div className="flex justify-start lg:justify-end">{periodFilter}</div>
    </header>
  );
}
