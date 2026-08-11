"use server";

import { revalidatePath } from "next/cache";

import { restoreBudget } from "../application/restore-budget";

export async function restoreBudgetAction(input: { workspaceId: string; budgetId: string }) {
  const result = await restoreBudget(input);

  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/budgets");
  }

  return result;
}
