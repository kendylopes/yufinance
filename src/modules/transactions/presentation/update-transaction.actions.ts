"use server";

import { revalidatePath } from "next/cache";

import { updateTransaction } from "../application/update-transaction";
import type { UpdateTransactionInput } from "../application/update-transaction.schema";

export async function updateTransactionAction(input: {
  workspaceId: string;
  transactionId: string;
  transaction: UpdateTransactionInput;
}) {
  const result = await updateTransaction(input);

  if (result.success) {
    revalidatePath("/dashboard/transactions");
  }

  return result;
}
