"use server";

import { revalidatePath } from "next/cache";

import { updateCategory } from "../application/update-category";
import type { UpdateCategoryInput } from "../application/update-category.schema";

export async function updateCategoryAction(input: {
  workspaceId: string;
  categoryId: string;
  data: UpdateCategoryInput;
}) {
  const result = await updateCategory(input);

  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/categories");
  }

  return result;
}
