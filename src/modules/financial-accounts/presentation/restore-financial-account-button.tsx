"use client";

import { useState } from "react";

import { restoreFinancialAccountAction } from "./restore-financial-account.actions";

type RestoreFinancialAccountButtonProps = {
  workspaceId: string;
  financialAccountId: string;
  financialAccountName: string;
};

export function RestoreFinancialAccountButton({
  workspaceId,
  financialAccountId,
  financialAccountName,
}: RestoreFinancialAccountButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRestore() {
    const confirmed = window.confirm(`Restaurar a conta "${financialAccountName}"?`);

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await restoreFinancialAccountAction({
        workspaceId,
        financialAccountId,
      });

      if (!result.success) {
        setErrorMessage(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleRestore}
        disabled={isSubmitting}
        className="text-sm underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Restaurando..." : "Restaurar"}
      </button>

      {errorMessage && (
        <p className="text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
