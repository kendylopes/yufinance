"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { NumberField } from "@/components/forms/number-field";
import { SelectField } from "@/components/forms/select-field";
import { TextField } from "@/components/forms/text-field";
import { TextareaField } from "@/components/forms/textarea-field";

import {
  type CreateTransactionInput,
  createTransactionSchema,
} from "../application/create-transaction.schema";
import { createTransactionAction } from "./create-transaction.actions";

type FinancialAccountOption = {
  id: string;
  name: string;
};

type CategoryOption = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

type CreateTransactionFormProps = {
  workspaceId: string;
  financialAccounts: FinancialAccountOption[];
  categories: CategoryOption[];
};

const transactionTypes = [
  {
    value: "INCOME",
    label: "Receita",
  },
  {
    value: "EXPENSE",
    label: "Despesa",
  },
] as const;

export function CreateTransactionForm({
  workspaceId,
  financialAccounts,
  categories,
}: CreateTransactionFormProps) {
  const financialAccountId = useId();
  const typeId = useId();
  const categoryId = useId();
  const descriptionId = useId();
  const amountId = useId();
  const occurredAtId = useId();
  const notesId = useId();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: getDefaultValues(),
  });

  const selectedType = watch("type");

  const availableCategories = useMemo(
    () => categories.filter((category) => category.type === selectedType),
    [categories, selectedType],
  );

  async function onSubmit(transaction: CreateTransactionInput) {
    setSuccessMessage(null);

    const result = await createTransactionAction({
      workspaceId,
      transaction,
    });

    if (!result.success) {
      setError("root", {
        message: result.message,
      });

      return;
    }

    reset(getDefaultValues());

    setSuccessMessage("Transação criada com sucesso.");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <SelectField
        id={financialAccountId}
        label="Conta financeira"
        error={errors.financialAccountId?.message}
        {...register("financialAccountId")}
      >
        <option value="">Selecione uma conta</option>

        {financialAccounts.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </SelectField>

      <SelectField
        id={typeId}
        label="Tipo"
        error={errors.type?.message}
        {...register("type", {
          onChange: () => {
            setValue("categoryId", "");
          },
        })}
      >
        {transactionTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </SelectField>

      <SelectField
        id={categoryId}
        label="Categoria"
        error={errors.categoryId?.message}
        {...register("categoryId")}
      >
        <option value="">Selecione uma categoria</option>

        {availableCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </SelectField>

      <TextField
        id={descriptionId}
        label="Descrição"
        autoComplete="off"
        placeholder="Ex.: Mercado, salário ou combustível"
        error={errors.description?.message}
        {...register("description")}
      />

      <NumberField
        id={amountId}
        label="Valor"
        inputMode="decimal"
        step="0.01"
        min="0.01"
        placeholder="0,00"
        error={errors.amount?.message}
        {...register("amount", {
          valueAsNumber: true,
        })}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={occurredAtId}>
          Data e hora
        </label>

        <input
          id={occurredAtId}
          type="datetime-local"
          aria-invalid={Boolean(errors.occurredAt)}
          className="w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2"
          {...register("occurredAt")}
        />

        {errors.occurredAt?.message && (
          <p className="text-sm" role="alert">
            {String(errors.occurredAt.message)}
          </p>
        )}
      </div>

      <TextareaField
        id={notesId}
        label="Observações"
        rows={4}
        placeholder="Opcional"
        error={errors.notes?.message}
        {...register("notes")}
      />

      {financialAccounts.length === 0 && (
        <output className="block text-sm">
          Cadastre uma conta financeira ativa antes de criar uma transação.
        </output>
      )}

      {availableCategories.length === 0 && (
        <output className="block text-sm">Não há categorias ativas para o tipo selecionado.</output>
      )}

      {errors.root?.message && (
        <p className="text-sm" role="alert">
          {errors.root.message}
        </p>
      )}

      {successMessage && <output className="block text-sm">{successMessage}</output>}

      <button
        type="submit"
        disabled={
          isSubmitting || financialAccounts.length === 0 || availableCategories.length === 0
        }
        className="w-full rounded-lg border px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Criando transação..." : "Criar transação"}
      </button>
    </form>
  );
}

function getDefaultValues(): CreateTransactionInput {
  return {
    financialAccountId: "",
    categoryId: "",
    type: "EXPENSE",
    description: "",
    amount: 0,
    occurredAt: getLocalDateTimeValue(new Date()),
    notes: "",
  };
}

function getLocalDateTimeValue(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}
