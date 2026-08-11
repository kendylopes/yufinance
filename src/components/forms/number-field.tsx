import { forwardRef, type InputHTMLAttributes, useId } from "react";

import { FormField } from "./form-field";

type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
  description?: string;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { label, error, description, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <FormField label={label} htmlFor={fieldId} error={error} description={description}>
      <input
        {...props}
        ref={ref}
        id={fieldId}
        type="number"
        aria-invalid={error ? true : undefined}
        className={
          className ?? "w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
        }
      />
    </FormField>
  );
});
