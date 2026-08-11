import { z } from "zod";

export const restoreBudgetSchema = z.object({
  workspaceId: z.uuid("Workspace inválido."),
  budgetId: z.uuid("Orçamento inválido."),
});

export type RestoreBudgetInput = z.input<typeof restoreBudgetSchema>;
