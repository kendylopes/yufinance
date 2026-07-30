import { z } from "zod";

export const financialAccountTypeSchema = z.enum([
  "CHECKING",
  "SAVINGS",
  "DIGITAL",
  "WALLET",
  "CASH",
]);

export const createFinancialAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(80, "O nome deve ter no máximo 80 caracteres."),

  type: financialAccountTypeSchema,

  initialBalance: z
    .string()
    .trim()
    .min(1, "Informe o saldo inicial.")
    .regex(/^-?\d+([.,]\d{1,4})?$/, "Informe um valor monetário válido.")
    .transform((value) => value.replace(",", ".")),
});

export type CreateFinancialAccountInput = z.input<typeof createFinancialAccountSchema>;

export type CreateFinancialAccountData = z.output<typeof createFinancialAccountSchema>;
