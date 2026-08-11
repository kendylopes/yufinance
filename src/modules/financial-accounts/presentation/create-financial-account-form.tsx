"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormError, FormSuccess } from "../../../components/forms/form-feedback";
import { FormSection } from "../../../components/forms/form-section";
import { SelectField } from "../../../components/forms/select-field";
import { SubmitButton } from "../../../components/forms/submit-button";
import { TextField } from "../../../components/forms/text-field";
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
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection
        title="Dados da conta"
        description="Informe os dados principais da conta financeira."
      >
        <TextField
          label="Nome da conta"
          autoComplete="off"
          placeholder="Ex.: Nubank"
          error={errors.name?.message}
          {...register("name")}
        />

        <SelectField label="Tipo" error={errors.type?.message} {...register("type")}>
          {financialAccountTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </SelectField>

        <TextField
          label="Saldo inicial"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0,00"
          description="Informe quanto já existe nessa conta. Ex.: 1500,25 ou -350,00."
          error={errors.initialBalance?.message}
          {...register("initialBalance")}
        />
      </FormSection>

      <FormError message={errors.root?.message} />

      <FormSuccess message={successMessage} />

      <SubmitButton
        isSubmitting={isSubmitting}
        idleLabel="Criar conta"
        submittingLabel="Criando conta..."
      />
    </form>
  );
}
