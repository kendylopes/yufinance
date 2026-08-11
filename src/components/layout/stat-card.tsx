import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  description?: string;
  trailing?: ReactNode;
};

export function StatCard({ label, value, description, trailing }: StatCardProps) {
  return (
    <article className="rounded-xl border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-sm text-muted-foreground">{label}</p>

          <div className="text-2xl font-semibold">{value}</div>

          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>

        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
    </article>
  );
}
