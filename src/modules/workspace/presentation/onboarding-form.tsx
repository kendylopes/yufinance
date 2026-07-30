"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";

import type { CreateInitialWorkspaceResult } from "../application/create-initial-workspace";
import {
  type CreateInitialWorkspaceInput,
  createInitialWorkspaceSchema,
} from "../application/create-initial-workspace.schema";
import { createInitialWorkspaceAction } from "./onboarding.actions";

export function OnboardingForm() {
  const nameId = useId();
  const typeId = useId();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateInitialWorkspaceInput>({
    resolver: zodResolver(createInitialWorkspaceSchema),
    defaultValues: {
      name: "",
      type: "PERSONAL",
    },
  });

  async function onSubmit(data: CreateInitialWorkspaceInput) {
    const result: CreateInitialWorkspaceResult = await createInitialWorkspaceAction(data);

    if (!result.success) {
      setError("root", {
        message: result.message,
      });

      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={nameId}>
          Nome do espaço
        </label>

        <input
          id={nameId}
          type="text"
          autoComplete="organization"
          placeholder="Minhas Finanças"
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
        <label className="text-sm font-medium" htmlFor={typeId}>
          Tipo
        </label>

        <select
          id={typeId}
          aria-invalid={Boolean(errors.type)}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          {...register("type")}
        >
          <option value="PERSONAL">Pessoal</option>
          <option value="COUPLE">Casal</option>
          <option value="FAMILY">Família</option>
        </select>

        {errors.type?.message && (
          <p className="text-sm" role="alert">
            {errors.type.message}
          </p>
        )}
      </div>

      {errors.root?.message && (
        <p className="text-sm" role="alert">
          {errors.root.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg border px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Criando espaço..." : "Começar a usar o YuFinance"}
      </button>
    </form>
  );
}
