"use server";

import { revalidatePath } from "next/cache";

import { restoreFinancialAccount } from "../application/restore-financial-account";

export async function restoreFinancialAccountAction(input: {
  workspaceId: string;
  financialAccountId: string;
}) {
  const result = await restoreFinancialAccount(input);

  if (result.success) {
    revalidatePath("/dashboard/accounts");
  }

  return result;
}
