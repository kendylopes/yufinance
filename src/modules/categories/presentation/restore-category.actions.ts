"use server";

import { revalidatePath } from "next/cache";

import { restoreCategory } from "../application/restore-category";

export async function restoreCategoryAction(input: { workspaceId: string; categoryId: string }) {
  const result = await restoreCategory(input);

  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/categories");
  }

  return result;
}
