"use server";

import { revalidatePath } from "next/cache";

import { updateBudget } from "../application/update-budget";
import type { UpdateBudgetInput } from "../application/update-budget.schema";

export async function updateBudgetAction(input: UpdateBudgetInput) {
  const result = await updateBudget(input);

  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/budgets");
  }

  return result;
}
