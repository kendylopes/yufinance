"use server";

import { revalidatePath } from "next/cache";

import { createBudget } from "../application/create-budget";
import type { CreateBudgetInput } from "../application/create-budget.schema";

export async function createBudgetAction(input: CreateBudgetInput) {
  const result = await createBudget(input);

  if (result.success) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/budgets");
  }

  return result;
}
