import { z } from "zod";

export const workspaceTypeSchema = z.enum(["PERSONAL", "COUPLE", "FAMILY"]);

export const createInitialWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),

  type: workspaceTypeSchema.default("PERSONAL"),
});

export type CreateInitialWorkspaceInput = z.input<typeof createInitialWorkspaceSchema>;

export type CreateInitialWorkspaceData = z.output<typeof createInitialWorkspaceSchema>;
