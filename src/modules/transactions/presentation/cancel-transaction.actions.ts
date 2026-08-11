"use server";

import { revalidatePath } from "next/cache";

import { cancelTransaction } from "../application/cancel-transaction";

export async function cancelTransactionAction(input: {
  workspaceId: string;
  transactionId: string;
}) {
  const result = await cancelTransaction(input);

  if (result.success) {
    revalidatePath("/dashboard/transactions");
  }

  return result;
}
