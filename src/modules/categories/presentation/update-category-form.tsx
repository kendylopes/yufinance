"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { useForm } from "react-hook-form";

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
  const nameId = useId();
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
    const result = await updateCategoryAction({ workspaceId, categoryId, data });

    if (!result.success) {
      setError("root", { message: result.message });
      return;
    }

    router.replace("/dashboard/categories");
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor={nameId}>
          Nome da categoria
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
