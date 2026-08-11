"use client";

import { useState } from "react";

import { restoreTransactionAction } from "./restore-transaction.actions";

type RestoreTransactionButtonProps = {
  workspaceId: string;
  transactionId: string;
};

export function RestoreTransactionButton({
  workspaceId,
  transactionId,
}: RestoreTransactionButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRestore() {
    const confirmed = window.confirm("Deseja realmente restaurar esta transação?");

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setIsPending(true);

    try {
      const result = await restoreTransactionAction({
        workspaceId,
        transactionId,
      });

      if (!result.success) {
        setErrorMessage(result.message);
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={handleRestore}
        className="rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Restaurando..." : "Restaurar"}
      </button>

      {errorMessage && (
        <p className="text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
