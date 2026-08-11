"use client";

import { useState } from "react";

import { cancelTransactionAction } from "./cancel-transaction.actions";

type CancelTransactionButtonProps = {
  workspaceId: string;
  transactionId: string;
};

export function CancelTransactionButton({
  workspaceId,
  transactionId,
}: CancelTransactionButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCancel() {
    const confirmed = window.confirm("Deseja realmente cancelar esta transação?");

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setIsPending(true);

    try {
      const result = await cancelTransactionAction({
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
        onClick={handleCancel}
        className="rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Cancelando..." : "Cancelar"}
      </button>

      {errorMessage && (
        <p className="text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
