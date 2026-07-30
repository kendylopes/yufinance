"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import {
  type CreateFinancialAccountInput,
  createFinancialAccountSchema,
} from "../application/create-financial-account.schema";
import { createFinancialAccountAction } from "./create-financial-account.actions";

type CreateFinancialAccountFormProps = {
  workspaceId: string;
};

const financialAccountTypes = [
  {
    value: "CHECKING",
    label: "Conta corrente",
  },
  {
    value: "SAVINGS",
    label: "Poupança",
  },
  {
    value: "DIGITAL",
    label: "Conta digital",
  },
  {
    value: "WALLET",
    label: "Carteira",
  },
  {
    value: "CASH",
    label: "Dinheiro em espécie",
  },
] as const;

export function CreateFinancialAccountForm({ workspaceId }: CreateFinancialAccountFormProps) {
  const nameId = useId();
  const typeId = useId();
  const initialBalanceId = useId();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateFinancialAccountInput>({
    resolver: zodResolver(createFinancialAccountSchema),
    defaultValues: {
      name: "",
      type: "CHECKING",
      initialBalance: "0",
    },
  });

  async function onSubmit(data: CreateFinancialAccountInput) {
    setSuccessMessage(null);

    const result = await createFinancialAccountAction({
      workspaceId,
      data,
    });

    if (!result.success) {
      setError("root", {
        message: result.message,
      });

      return;
    }

    reset({
      name: "",
      type: "CHECKING",
      initialBalance: "0",
    });

    setSuccessMessage("Conta financeira criada com sucesso.");
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
          placeholder="Ex.: Nubank"
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

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={initialBalanceId}>
          Saldo inicial
        </label>

        <input
          id={initialBalanceId}
          type="text"
          inputMode="decimal"
          placeholder="0,00"
          aria-invalid={Boolean(errors.initialBalance)}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          {...register("initialBalance")}
        />

        <p className="text-xs">Informe quanto já existe nessa conta. Ex.: 1500,25 ou -350,00.</p>

        {errors.initialBalance?.message && (
          <p className="text-sm" role="alert">
            {errors.initialBalance.message}
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
