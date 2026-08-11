import { z } from "zod";

export const archiveBudgetSchema = z.object({
  workspaceId: z.uuid("Workspace inválido."),
  budgetId: z.uuid("Orçamento inválido."),
});

export type ArchiveBudgetInput = z.input<typeof archiveBudgetSchema>;
