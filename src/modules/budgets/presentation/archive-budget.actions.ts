"use server";

import { revalidatePath } from "next/cache";

import { archiveBudget } from "../application/archive-budget";

export async function archiveBudgetAction(input: { workspaceId: string; budgetId: string }) {
  const result = await archiveBudget(input);

  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/budgets");
  }

  return result;
}
