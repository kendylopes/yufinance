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
  type CreateCategoryInput,
  createCategorySchema,
} from "../application/create-category.schema";
import { createCategoryAction } from "./create-category.actions";

type CreateCategoryFormProps = {
  workspaceId: string;
};

const categoryTypes = [
  { value: "INCOME", label: "Receita" },
  { value: "EXPENSE", label: "Despesa" },
] as const;

export function CreateCategoryForm({ workspaceId }: CreateCategoryFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      type: "EXPENSE",
    },
  });

  async function onSubmit(data: CreateCategoryInput) {
    setSuccessMessage(null);

    const result = await createCategoryAction({
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
      type: "EXPENSE",
    });

    setSuccessMessage("Categoria criada com sucesso.");
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection title="Dados da categoria" description="Defina o nome e o tipo da categoria.">
        <TextField
          label="Nome da categoria"
          autoComplete="off"
          placeholder="Ex.: Alimentação"
          error={errors.name?.message}
          {...register("name")}
        />

        <SelectField label="Tipo" error={errors.type?.message} {...register("type")}>
          {categoryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </SelectField>
      </FormSection>

      <FormError message={errors.root?.message} />

      <FormSuccess message={successMessage} />

      <SubmitButton
        isSubmitting={isSubmitting}
        idleLabel="Criar categoria"
        submittingLabel="Criando categoria..."
      />
    </form>
  );
}
