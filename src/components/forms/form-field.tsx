import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  description?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, description, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={htmlFor}>
        {label}
      </label>

      {children}

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {error && (
        <p className="text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
