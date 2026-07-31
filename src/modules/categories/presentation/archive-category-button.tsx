"use client";

import { useState } from "react";
import { archiveCategoryAction } from "./archive-category.actions";

type ArchiveCategoryButtonProps = {
  workspaceId: string;
  categoryId: string;
  categoryName: string;
};

export function ArchiveCategoryButton({
  workspaceId,
  categoryId,
  categoryName,
}: ArchiveCategoryButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleArchive() {
    if (!window.confirm(`Arquivar a categoria "${categoryName}"?`)) return;

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await archiveCategoryAction({ workspaceId, categoryId });
      if (!result.success) setErrorMessage(result.message);
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
