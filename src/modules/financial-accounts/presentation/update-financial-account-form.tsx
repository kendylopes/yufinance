"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";

import {
  type UpdateFinancialAccountInput,
  updateFinancialAccountSchema,
} from "../application/update-financial-account.schema";
import { updateFinancialAccountAction } from "./update-financial-account.actions";

type UpdateFinancialAccountFormProps = {
  workspaceId: string;
  financialAccountId: string;
  defaultValues: UpdateFinancialAccountInput;
};

const financialAccountTypes = [
  { value: "CHECKING", label: "Conta corrente" },
  { value: "SAVINGS", label: "Poupança" },
  { value: "DIGITAL", label: "Conta digital" },
  { value: "WALLET", label: "Carteira" },
  { value: "CASH", label: "Dinheiro em espécie" },
] as const;

export function UpdateFinancialAccountForm({
  workspaceId,
  financialAccountId,
  defaultValues,
}: UpdateFinancialAccountFormProps) {
  const nameId = useId();
  const typeId = useId();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFinancialAccountInput>({
    resolver: zodResolver(updateFinancialAccountSchema),
    defaultValues,
  });

  async function onSubmit(data: UpdateFinancialAccountInput) {
    const result = await updateFinancialAccountAction({
      workspaceId,
      financialAccountId,
      data,
    });

    if (!result.success) {
      setError("root", {
        message: result.message,
      });

      return;
    }

    router.replace("/dashboard/accounts");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={nameId}>
          Nome da conta
        </label>

        <input
          id={nameId}
          type="text"
          autoComplete="off"
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
          {financialAccountTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
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
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
