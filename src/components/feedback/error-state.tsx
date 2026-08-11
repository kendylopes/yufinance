import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export function ErrorState({
  title = "Não foi possível carregar os dados",
  message,
  action,
}: ErrorStateProps) {
  return (
    <section className="rounded-xl border p-6" role="alert">
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold">{title}</h2>

          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </section>
  );
}
