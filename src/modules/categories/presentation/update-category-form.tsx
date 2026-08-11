"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormError } from "../../../components/forms/form-feedback";
import { FormSection } from "../../../components/forms/form-section";
import { SubmitButton } from "../../../components/forms/submit-button";
import { TextField } from "../../../components/forms/text-field";
import {
  type UpdateCategoryInput,
  updateCategorySchema,
} from "../application/update-category.schema";
import { updateCategoryAction } from "./update-category.actions";

type UpdateCategoryFormProps = {
  workspaceId: string;
  categoryId: string;
  defaultValues: UpdateCategoryInput;
};

export function UpdateCategoryForm({
  workspaceId,
  categoryId,
  defaultValues,
}: UpdateCategoryFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues,
  });

  async function onSubmit(data: UpdateCategoryInput) {
    const result = await updateCategoryAction({
      workspaceId,
      categoryId,
      data,
    });

    if (!result.success) {
      setError("root", {
        message: result.message,
      });

      return;
    }

    router.replace("/dashboard/categories");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormSection title="Dados da categoria" description="Atualize as informações da categoria.">
        <TextField
          label="Nome da categoria"
          autoComplete="off"
          error={errors.name?.message}
          {...register("name")}
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
