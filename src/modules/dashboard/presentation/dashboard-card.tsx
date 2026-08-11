import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
};

export function DashboardCard({ title, value, subtitle, icon }: DashboardCardProps) {
  return (
    <article className="rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>

          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>

        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </article>
  );
}
