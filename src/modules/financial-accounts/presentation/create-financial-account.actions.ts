"use server";

import { revalidatePath } from "next/cache";

import { createFinancialAccount } from "../application/create-financial-account";
import type { CreateFinancialAccountInput } from "../application/create-financial-account.schema";

export async function createFinancialAccountAction(input: {
  workspaceId: string;
  data: CreateFinancialAccountInput;
}) {
  const result = await createFinancialAccount(input);

  if (result.success) {
    revalidatePath("/dashboard");
  }

  return result;
}
