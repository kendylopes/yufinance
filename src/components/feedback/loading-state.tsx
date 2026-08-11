type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Carregando..." }: LoadingStateProps) {
  return (
    <output
      className="flex min-h-32 items-center justify-center rounded-xl border p-6"
      aria-live="polite"
    >
      <span className="text-sm text-muted-foreground">{label}</span>
    </output>
  );
}
