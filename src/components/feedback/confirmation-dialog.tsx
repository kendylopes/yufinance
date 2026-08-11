"use client";

import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
  useState,
} from "react";

type ConfirmationDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  onConfirm: () => Promise<void>;
};

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  pendingLabel = "Confirmando...",
  onConfirm,
}: ConfirmationDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);

    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  }

  function renderTrigger() {
    if (!isValidElement(trigger)) {
      return (
        <button type="button" onClick={() => setOpen(true)}>
          {trigger}
        </button>
      );
    }

    return cloneElement(
      trigger as ReactElement<{
        onClick?: () => void;
      }>,
      {
        onClick: () => setOpen(true),
      },
    );
  }

  if (!open) {
    return renderTrigger();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="space-y-2">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>

          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => setOpen(false)}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="rounded-lg border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
