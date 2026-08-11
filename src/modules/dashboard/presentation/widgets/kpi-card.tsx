type KpiCardProps = {
  label: string;
  value: string;
  helperText?: string;
};

export function KpiCard({ label, value, helperText }: KpiCardProps) {
  return (
    <article className="rounded-xl border bg-card p-5">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{label}</p>

        <p className="text-2xl font-semibold tracking-tight">{value}</p>

        {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
      </div>
    </article>
  );
}
