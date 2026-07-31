"use client";

import { useState } from "react";
import { restoreCategoryAction } from "./restore-category.actions";

type RestoreCategoryButtonProps = {
  workspaceId: string;
  categoryId: string;
  categoryName: string;
};

export function RestoreCategoryButton({
  workspaceId,
  categoryId,
  categoryName,
}: RestoreCategoryButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRestore() {
    if (!window.confirm(`Restaurar a categoria "${categoryName}"?`)) return;

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await restoreCategoryAction({ workspaceId, categoryId });
      if (!result.success) setErrorMessage(result.message);
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
