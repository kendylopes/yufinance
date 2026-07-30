"use client";

import { useState } from "react";

import { archiveFinancialAccountAction } from "./archive-financial-account.actions";

type ArchiveFinancialAccountButtonProps = {
  workspaceId: string;
  financialAccountId: string;
  financialAccountName: string;
};

export function ArchiveFinancialAccountButton({
  workspaceId,
  financialAccountId,
  financialAccountName,
}: ArchiveFinancialAccountButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleArchive() {
    const confirmed = window.confirm(`Arquivar a conta "${financialAccountName}"?`);

    if (!confirmed) {
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await archiveFinancialAccountAction({
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
        onClick={handleArchive}
        disabled={isSubmitting}
        className="text-sm underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Arquivando..." : "Arquivar"}
      </button>

      {errorMessage && (
        <p className="text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
