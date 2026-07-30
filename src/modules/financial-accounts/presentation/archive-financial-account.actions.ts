"use server";

import { revalidatePath } from "next/cache";

import { archiveFinancialAccount } from "../application/archive-financial-account";

export async function archiveFinancialAccountAction(input: {
  workspaceId: string;
  financialAccountId: string;
}) {
  const result = await archiveFinancialAccount(input);

  if (result.success) {
    revalidatePath("/dashboard/accounts");
  }

  return result;
}
