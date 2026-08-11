import { z } from "zod";

export const listBudgetsSchema = z.object({
  workspaceId: z.uuid("Workspace inválido."),

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
});

export type ListBudgetsInput = z.input<typeof listBudgetsSchema>;
