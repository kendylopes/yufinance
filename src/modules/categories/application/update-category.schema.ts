import { z } from "zod";

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(60, "O nome deve ter no máximo 60 caracteres."),
});

export type UpdateCategoryInput = z.input<typeof updateCategorySchema>;

export type UpdateCategoryData = z.output<typeof updateCategorySchema>;
