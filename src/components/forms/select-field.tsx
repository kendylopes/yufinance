import { forwardRef, type SelectHTMLAttributes, useId } from "react";

import { FormField } from "./form-field";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  description?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, description, id, className, children, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FormField label={label} htmlFor={fieldId} error={error} description={description}>
      <select
        {...props}
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={
          className ?? "w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
        }
      >
        {children}
      </select>
    </FormField>
  );
});
