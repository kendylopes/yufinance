"use server";

import { revalidatePath } from "next/cache";

import { archiveCategory } from "../application/archive-category";

export async function archiveCategoryAction(input: { workspaceId: string; categoryId: string }) {
  const result = await archiveCategory(input);

  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/categories");
  }

  return result;
}
