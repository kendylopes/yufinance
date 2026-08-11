import type { ReactNode } from "react";

type FormSectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="space-y-5">
      {(title || description) && (
        <legend className="mb-5">
          {title && <span className="block font-semibold">{title}</span>}

          {description && (
            <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
          )}
        </legend>
      )}

      {children}
    </fieldset>
  );
}
