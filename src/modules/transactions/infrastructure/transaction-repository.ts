import "server-only";

import { and, eq, isNotNull, isNull } from "drizzle-orm";

import { db } from "@/db";
import { categories, financialAccounts, transactions } from "@/db/schema";
import type { Transaction } from "@/db/schema/core/transactions";

import type { CreateTransactionData } from "../application/create-transaction.schema";
import type { UpdateTransactionData } from "../application/update-transaction.schema";

export async function createTransactionRecord(input: {
  workspaceId: string;
  transaction: CreateTransactionData;
}): Promise<{
  id: string;
}> {
  const result = await db
    .insert(transactions)
    .values({
      workspaceId: input.workspaceId,
      financialAccountId: input.transaction.financialAccountId,
      categoryId: input.transaction.categoryId,
      type: input.transaction.type,
      description: input.transaction.description,
      amount: input.transaction.amount,
      occurredAt: input.transaction.occurredAt,
      notes: input.transaction.notes,
    })
    .returning({
      id: transactions.id,
    });

  const createdTransaction = result[0];

  if (!createdTransaction) {
    throw new Error("Transaction was not created.");
  }

  return createdTransaction;
}

export async function findActiveTransactionById(
  transactionId: string,
  workspaceId: string,
): Promise<Transaction | null> {
  const result = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.id, transactionId),
        eq(transactions.workspaceId, workspaceId),
        isNull(transactions.canceledAt),
      ),
    )
    .limit(1);

  return result[0] ?? null;
}

export async function findCanceledTransactionById(
  transactionId: string,
  workspaceId: string,
): Promise<Transaction | null> {
  const result = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.id, transactionId),
        eq(transactions.workspaceId, workspaceId),
        isNotNull(transactions.canceledAt),
      ),
    )
    .limit(1);

  return result[0] ?? null;
}

export async function listActiveTransactionsByWorkspace(workspaceId: string) {
  return db
    .select()
    .from(transactions)
    .where(and(eq(transactions.workspaceId, workspaceId), isNull(transactions.canceledAt)))
    .orderBy(transactions.occurredAt);
}

export async function listCanceledTransactionsByWorkspace(workspaceId: string) {
  return db
    .select()
    .from(transactions)
    .where(and(eq(transactions.workspaceId, workspaceId), isNotNull(transactions.canceledAt)))
    .orderBy(transactions.occurredAt);
}

export async function listTransactionViewsByWorkspace(workspaceId: string) {
  return db
    .select({
      id: transactions.id,
      description: transactions.description,
      type: transactions.type,
      amount: transactions.amount,
      occurredAt: transactions.occurredAt,
      canceledAt: transactions.canceledAt,
      categoryName: categories.name,
      financialAccountName: financialAccounts.name,
    })
    .from(transactions)
    .innerJoin(categories, eq(categories.id, transactions.categoryId))
    .innerJoin(financialAccounts, eq(financialAccounts.id, transactions.financialAccountId))
    .where(eq(transactions.workspaceId, workspaceId))
    .orderBy(transactions.occurredAt);
}

export async function updateActiveTransactionRecord(input: {
  transactionId: string;
  workspaceId: string;
  transaction: UpdateTransactionData;
}): Promise<Transaction | null> {
  const result = await db
    .update(transactions)
    .set({
      financialAccountId: input.transaction.financialAccountId,
      categoryId: input.transaction.categoryId,
      type: input.transaction.type,
      description: input.transaction.description,
      amount: input.transaction.amount,
      occurredAt: input.transaction.occurredAt,
      notes: input.transaction.notes,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(transactions.id, input.transactionId),
        eq(transactions.workspaceId, input.workspaceId),
        isNull(transactions.canceledAt),
      ),
    )
    .returning();

  return result[0] ?? null;
}

export async function cancelActiveTransactionRecord(input: {
  transactionId: string;
  workspaceId: string;
}): Promise<Transaction | null> {
  const result = await db
    .update(transactions)
    .set({
      canceledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(transactions.id, input.transactionId),
        eq(transactions.workspaceId, input.workspaceId),
        isNull(transactions.canceledAt),
      ),
    )
    .returning();

  return result[0] ?? null;
}

export async function restoreCanceledTransactionRecord(input: {
  transactionId: string;
  workspaceId: string;
}): Promise<Transaction | null> {
  const result = await db
    .update(transactions)
    .set({
      canceledAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(transactions.id, input.transactionId),
        eq(transactions.workspaceId, input.workspaceId),
        isNotNull(transactions.canceledAt),
      ),
    )
    .returning();

  return result[0] ?? null;
}
