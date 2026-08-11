"use server";

import { revalidatePath } from "next/cache";

import { createTransaction } from "../application/create-transaction";
import type { CreateTransactionInput } from "../application/create-transaction.schema";

export async function createTransactionAction(input: {
  workspaceId: string;
  transaction: CreateTransactionInput;
}) {
  const result = await createTransaction(input);

  if (result.success) {
    revalidatePath("/dashboard/transactions");
  }

  return result;
}
