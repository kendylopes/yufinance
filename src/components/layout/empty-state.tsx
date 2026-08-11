import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <div className="mx-auto max-w-md space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>

          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
