import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  meta?: ReactNode;
  actions?: ReactNode;
};

export function SectionHeader({ title, description, meta, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>

        {description && <p className="text-sm text-muted-foreground">{description}</p>}

        {meta && <div className="text-sm text-muted-foreground">{meta}</div>}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
