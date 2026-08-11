"use client";

import { useState } from "react";

import { ConfirmationDialog } from "../../../components/feedback/confirmation-dialog";
import { archiveBudgetAction } from "./archive-budget.actions";

type ArchiveBudgetButtonProps = {
  workspaceId: string;
  budgetId: string;
  categoryName: string;
};

export function ArchiveBudgetButton({
  workspaceId,
  budgetId,
  categoryName,
}: ArchiveBudgetButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleArchive() {
    setErrorMessage(null);

    const result = await archiveBudgetAction({
      workspaceId,
      budgetId,
    });

    if (!result.success) {
      setErrorMessage(result.message);

      throw new Error(result.message);
    }
  }

  return (
    <div className="space-y-2">
      <ConfirmationDialog
        trigger={
          <button type="button" className="text-sm underline underline-offset-4">
            Arquivar
          </button>
        }
        title="Arquivar orçamento"
        description={`O orçamento de ${categoryName} será movido para os arquivados.`}
        confirmLabel="Arquivar"
        pendingLabel="Arquivando..."
        onConfirm={handleArchive}
      />

      {errorMessage && (
        <p className="text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
