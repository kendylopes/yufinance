import { z } from "zod";

import { financialAccountTypeSchema } from "./create-financial-account.schema";

export const updateFinancialAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),

  type: financialAccountTypeSchema,
});

export type UpdateFinancialAccountInput = z.input<typeof updateFinancialAccountSchema>;

export type UpdateFinancialAccountData = z.output<typeof updateFinancialAccountSchema>;
