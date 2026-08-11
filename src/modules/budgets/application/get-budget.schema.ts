import { z } from "zod";

export const getBudgetSchema = z.object({
  workspaceId: z.uuid("Workspace inválido."),
  budgetId: z.uuid("Orçamento inválido."),
});

export type GetBudgetInput = z.input<typeof getBudgetSchema>;
