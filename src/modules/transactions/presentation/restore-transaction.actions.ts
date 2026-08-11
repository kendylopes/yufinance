"use server";

import { revalidatePath } from "next/cache";

import { restoreTransaction } from "../application/restore-transaction";

export async function restoreTransactionAction(input: {
  workspaceId: string;
  transactionId: string;
}) {
  const result = await restoreTransaction(input);

  if (result.success) {
    revalidatePath("/dashboard/transactions");
  }

  return result;
}
