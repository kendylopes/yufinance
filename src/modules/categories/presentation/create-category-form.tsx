"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

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
  const nameId = useId();
  const typeId = useId();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "", type: "EXPENSE" },
  });

  async function onSubmit(data: CreateCategoryInput) {
    setSuccessMessage(null);
    const result = await createCategoryAction({ workspaceId, data });

    if (!result.success) {
      setError("root", { message: result.message });
      return;
    }

    reset({ name: "", type: "EXPENSE" });
    setSuccessMessage("Categoria criada com sucesso.");
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
          placeholder="Ex.: Alimentação"
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
          {categoryTypes.map((type) => (
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
      {successMessage && <output className="text-sm">{successMessage}</output>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg border px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Criando categoria..." : "Criar categoria"}
      </button>
    </form>
  );
}
