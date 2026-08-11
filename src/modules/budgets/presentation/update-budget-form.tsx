"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormError } from "../../../components/forms/form-feedback";
import { FormSection } from "../../../components/forms/form-section";
import { NumberField } from "../../../components/forms/number-field";
import { SubmitButton } from "../../../components/forms/submit-button";
import { TextField } from "../../../components/forms/text-field";
import { type UpdateBudgetInput, updateBudgetSchema } from "../application/update-budget.schema";
import { updateBudgetAction } from "./update-budget.actions";

type UpdateBudgetFormProps = {
  workspaceId: string;
  budgetId: string;
  defaultValues: {
    month: number;
    year: number;
    plannedAmount: string | number;
  };
};

export function UpdateBudgetForm({ workspaceId, budgetId, defaultValues }: UpdateBudgetFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBudgetInput>({
    resolver: zodResolver(updateBudgetSchema),
    defaultValues: {
      workspaceId,
      budgetId,
      month: defaultValues.month,
      year: defaultValues.year,
      plannedAmount: defaultValues.plannedAmount,
    },
  });

  async function onSubmit(data: UpdateBudgetInput) {
    const result = await updateBudgetAction(data);

    if (!result.success) {
      setError("root", {
        message: result.message,
      });

      return;
    }

    router.replace("/dashboard/budgets");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register("workspaceId")} />

      <input type="hidden" {...register("budgetId")} />

      <FormSection
        title="Planejamento"
        description="Atualize o período e o limite planejado do orçamento."
      >
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
          description="Atualize o limite de gastos planejado para esta categoria."
          error={errors.plannedAmount?.message}
          {...register("plannedAmount")}
        />
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
