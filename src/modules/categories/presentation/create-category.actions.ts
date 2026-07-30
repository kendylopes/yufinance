"use server";

import { revalidatePath } from "next/cache";

import { createCategory } from "../application/create-category";
import type { CreateCategoryInput } from "../application/create-category.schema";

export async function createCategoryAction(input: {
  workspaceId: string;
  data: CreateCategoryInput;
}) {
  const result = await createCategory(input);

  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/categories");
  }

  return result;
}
