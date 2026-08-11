"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormError } from "../../../components/forms/form-feedback";
import { FormSection } from "../../../components/forms/form-section";
import { SelectField } from "../../../components/forms/select-field";
import { SubmitButton } from "../../../components/forms/submit-button";
import { TextField } from "../../../components/forms/text-field";
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

export function UpdateFinancialAccountForm({
  workspaceId,
  financialAccountId,
  defaultValues,
}: UpdateFinancialAccountFormProps) {
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
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection
        title="Dados da conta"
        description="Atualize o nome e o tipo da conta financeira."
      >
        <TextField
          label="Nome da conta"
          autoComplete="off"
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
      </FormSection>

      <FormError message={errors.root?.message} />

      <SubmitButton
        isSubmitting={isSubmitting}
        idleLabel="Salvar alterações"
        submittingLabel="Salvando..."
      />
    </form>
  );
}
