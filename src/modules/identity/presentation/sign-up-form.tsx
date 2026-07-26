"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { registerUser } from "../application/register-user";
import { type RegisterUserInput, registerUserSchema } from "../application/register-user.schema";

export function SignUpForm() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordConfirmationId = useId();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(data: RegisterUserInput) {
    setSuccessMessage(null);

    const result = await registerUser(data);

    if (!result.success) {
      setError("root", {
        type: "server",
        message: result.message,
      });

      return;
    }

    reset();

    setSuccessMessage("Conta criada com sucesso.");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={nameId}>
          Nome
        </label>

        <input
          id={nameId}
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          aria-invalid={Boolean(errors.name)}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          {...register("name")}
        />

        {errors.name?.message && (
          <p className="text-sm" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={emailId}>
          E-mail
        </label>

        <input
          id={emailId}
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          aria-invalid={Boolean(errors.email)}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          {...register("email")}
        />

        {errors.email?.message && (
          <p className="text-sm" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={passwordId}>
          Senha
        </label>

        <input
          id={passwordId}
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          aria-invalid={Boolean(errors.password)}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          {...register("password")}
        />

        {errors.password?.message && (
          <p className="text-sm" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={passwordConfirmationId}>
          Confirmar senha
        </label>

        <input
          id={passwordConfirmationId}
          type="password"
          autoComplete="new-password"
          placeholder="Digite a senha novamente"
          aria-invalid={Boolean(errors.passwordConfirmation)}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          {...register("passwordConfirmation")}
        />

        {errors.passwordConfirmation?.message && (
          <p className="text-sm" role="alert">
            {errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      {errors.root?.message && (
        <p className="text-sm" role="alert">
          {errors.root.message}
        </p>
      )}

      {successMessage && <output className="text-sm">{successMessage}</output>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg border px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
