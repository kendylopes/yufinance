import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),

  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("YuFinance"),
  NEXT_PUBLIC_APP_URL: z.string().min(1),

  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().min(1),
});

const parsedEnv = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,

  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
});

if (!parsedEnv.success) {
  console.error("Variáveis de ambiente inválidas:", parsedEnv.error.flatten().fieldErrors);

  throw new Error("Falha ao validar as variáveis de ambiente.");
}

export const env = parsedEnv.data;
