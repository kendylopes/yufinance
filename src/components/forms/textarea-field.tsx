import { forwardRef, type TextareaHTMLAttributes, useId } from "react";

import { FormField } from "./form-field";

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  description?: string;
};

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ label, error, description, id, className, ...props }, ref) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <FormField label={label} htmlFor={fieldId} error={error} description={description}>
        <textarea
          {...props}
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          className={
            className ??
            "min-h-24 w-full resize-y rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          }
        />
      </FormField>
    );
  },
);
