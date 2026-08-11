import { z } from "zod";

export const updateTransactionSchema = z.object({
  financialAccountId: z.uuid(),

  categoryId: z.uuid(),

  type: z.enum(["INCOME", "EXPENSE"]),

  description: z
    .string()
    .trim()
    .min(2, "A descrição deve possuir pelo menos 2 caracteres.")
    .max(120, "A descrição deve possuir no máximo 120 caracteres."),

  amount: z.coerce
    .number()
    .positive("O valor deve ser maior que zero.")
    .transform((value) => value.toFixed(4)),

  occurredAt: z.coerce.date(),

  notes: z
    .string()
    .trim()
    .max(500, "A observação deve possuir no máximo 500 caracteres.")
    .nullish()
    .transform((value) => value || null),
});

export type UpdateTransactionInput = z.input<typeof updateTransactionSchema>;

export type UpdateTransactionData = z.output<typeof updateTransactionSchema>;
