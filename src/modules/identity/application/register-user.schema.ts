import * as z from "zod";

export const registerUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve ter pelo menos 2 caracteres.")
      .max(100, "O nome deve ter no máximo 100 caracteres."),

    email: z.email("Informe um e-mail válido."),

    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      .max(128, "A senha deve ter no máximo 128 caracteres."),

    passwordConfirmation: z.string().min(1, "Confirme a senha."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não são iguais.",
    path: ["passwordConfirmation"],
  });

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
