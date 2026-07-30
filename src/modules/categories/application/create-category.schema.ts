import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(60, "O nome deve ter no máximo 60 caracteres."),

  type: z.enum(["INCOME", "EXPENSE"]),
});

export type CreateCategoryInput = z.input<typeof createCategorySchema>;

export type CreateCategoryData = z.output<typeof createCategorySchema>;
