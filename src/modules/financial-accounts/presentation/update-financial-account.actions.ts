"use server";

import { revalidatePath } from "next/cache";

import { updateFinancialAccount } from "../application/update-financial-account";
import type { UpdateFinancialAccountInput } from "../application/update-financial-account.schema";

export async function updateFinancialAccountAction(input: {
  workspaceId: string;
  financialAccountId: string;
  data: UpdateFinancialAccountInput;
}) {
  const result = await updateFinancialAccount(input);

  if (result.success) {
    revalidatePath("/dashboard/accounts");
  }

  return result;
}
