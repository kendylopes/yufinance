"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormError, FormSuccess } from "../../../components/forms/form-feedback";
import { FormSection } from "../../../components/forms/form-section";
import { NumberField } from "../../../components/forms/number-field";
import { SelectField } from "../../../components/forms/select-field";
import { SubmitButton } from "../../../components/forms/submit-button";
import { TextField } from "../../../components/forms/text-field";
import { type CreateBudgetInput, createBudgetSchema } from "../application/create-budget.schema";
import { createBudgetAction } from "./create-budget.actions";

type CreateBudgetFormProps = {
  workspaceId: string;
  categories: {
    id: string;
    name: string;
  }[];
};

export function CreateBudgetForm({ workspaceId, categories }: CreateBudgetFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentDate = new Date();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateBudgetInput>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      workspaceId,
      categoryId: categories[0]?.id ?? "",
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      plannedAmount: "",
    },
  });

  async function onSubmit(data: CreateBudgetInput) {
    setSuccessMessage(null);

    const result = await createBudgetAction(data);

    if (!result.success) {
      setError("root", {
        message: result.message,
      });

      return;
    }

    reset({
      workspaceId,
      categoryId: categories[0]?.id ?? "",
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      plannedAmount: "",
    });

    setSuccessMessage("Orçamento criado com sucesso.");
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register("workspaceId")} />

      <FormSection
        title="Planejamento"
        description="Defina a categoria, o período e o limite de gastos."
      >
        <SelectField
          label="Categoria"
          error={errors.categoryId?.message}
          {...register("categoryId")}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>

        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            label="Mês"
            min={1}
            max={12}
            error={errors.month?.message}
            {...register("month", {
              valueAsNumber: true,
            })}
          />

          <NumberField
            label="Ano"
            min={2000}
            max={2100}
            error={errors.year?.message}
            {...register("year", {
              valueAsNumber: true,
            })}
          />
        </div>

        <TextField
          label="Valor planejado"
          inputMode="decimal"
          autoComplete="off"
          placeholder="Ex.: 1200,00"
          description="Informe o limite de gastos para esta categoria no período."
          error={errors.plannedAmount?.message}
          {...register("plannedAmount")}
        />
      </FormSection>

      <FormError message={errors.root?.message} />

      <FormSuccess message={successMessage} />

      <SubmitButton
        isSubmitting={isSubmitting}
        idleLabel="Criar orçamento"
        submittingLabel="Criando orçamento..."
      />
    </form>
  );
}
