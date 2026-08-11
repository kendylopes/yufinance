import { z } from "zod";

export const createBudgetSchema = z.object({
  workspaceId: z.uuid("Workspace inválido."),

  categoryId: z.uuid("Categoria inválida."),

  month: z
    .number()
    .int("O mês deve ser um número inteiro.")
    .min(1, "O mês deve estar entre 1 e 12.")
    .max(12, "O mês deve estar entre 1 e 12."),

  year: z
    .number()
    .int("O ano deve ser um número inteiro.")
    .min(2000, "O ano deve ser igual ou superior a 2000.")
    .max(2100, "O ano deve ser igual ou inferior a 2100."),

  plannedAmount: z.coerce
    .number()
    .finite("O valor planejado deve ser válido.")
    .positive("O valor planejado deve ser maior que zero."),
});

export type CreateBudgetInput = z.input<typeof createBudgetSchema>;

export type CreateBudgetData = z.output<typeof createBudgetSchema>;
