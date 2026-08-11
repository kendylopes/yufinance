"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";

import { authClient } from "../infrastructure/auth-client";

export function LoginForm() {
  const router = useRouter();

  const emailId = useId();
  const passwordId = useId();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setErrorMessage("Informe o e-mail e a senha.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setErrorMessage(
          result.error.message ?? "Não foi possível entrar. Verifique suas credenciais.",
        );
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Não foi possível entrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit} noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={emailId}>
          E-mail
        </label>

        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={passwordId}>
          Senha
        </label>

        <input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          required
        />
      </div>

      {errorMessage && (
        <p className="text-sm" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg border px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm">
        Ainda não possui uma conta?{" "}
        <Link className="underline underline-offset-4" href="/register">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
