import type { DashboardKpisDto } from "../../../application/dashboard-kpis.dto";
import { KpiCard } from "../kpi-card";

type DashboardKpisProps = {
  kpis: DashboardKpisDto;
};

export function DashboardKpis({ kpis }: DashboardKpisProps) {
  return (
    <section
      aria-label="Indicadores do Dashboard"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <KpiCard
        label="Contas ativas"
        value={String(kpis.activeAccountsCount)}
        helperText="Contas disponíveis para movimentação"
      />

      <KpiCard
        label="Categorias ativas"
        value={String(kpis.activeCategoriesCount)}
        helperText="Categorias disponíveis no Workspace"
      />

      <KpiCard
        label="Transações no período"
        value={String(kpis.periodTransactionsCount)}
        helperText="Movimentações não canceladas"
      />

      <KpiCard
        label="Última movimentação"
        value={formatLastMovement(kpis.lastMovementAt)}
        helperText={
          kpis.lastMovementAt
            ? "Data da movimentação mais recente"
            : "Nenhuma movimentação registrada"
        }
      />
    </section>
  );
}

function formatLastMovement(date: Date | null) {
  if (!date) {
    return "Sem dados";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}
