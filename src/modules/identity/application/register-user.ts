import { authClient } from "../infrastructure/auth-client";
import { type RegisterUserInput, registerUserSchema } from "./register-user.schema";

export type RegisterUserResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResult> {
  const validation = registerUserSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: "Os dados informados não são válidos.",
    };
  }

  const { name, email, password } = validation.data;

  try {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: getRegisterUserErrorMessage(error.code),
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível conectar ao serviço de autenticação. Tente novamente.",
    };
  }
}

function getRegisterUserErrorMessage(code?: string): string {
  switch (code) {
    case "USER_ALREADY_EXISTS":
      return "Não foi possível concluir o cadastro com os dados informados.";

    default:
      return "Não foi possível criar sua conta. Tente novamente.";
  }
}
