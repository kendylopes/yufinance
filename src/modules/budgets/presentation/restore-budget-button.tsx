"use client";

import { useState } from "react";

import { ConfirmationDialog } from "../../../components/feedback/confirmation-dialog";
import { restoreBudgetAction } from "./restore-budget.actions";

type RestoreBudgetButtonProps = {
  workspaceId: string;
  budgetId: string;
  categoryName: string;
};

export function RestoreBudgetButton({
  workspaceId,
  budgetId,
  categoryName,
}: RestoreBudgetButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRestore() {
    setErrorMessage(null);

    const result = await restoreBudgetAction({
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
            Restaurar
          </button>
        }
        title="Restaurar orçamento"
        description={`O orçamento de ${categoryName} voltará para a lista ativa.`}
        confirmLabel="Restaurar"
        pendingLabel="Restaurando..."
        onConfirm={handleRestore}
      />

      {errorMessage && (
        <p className="text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
