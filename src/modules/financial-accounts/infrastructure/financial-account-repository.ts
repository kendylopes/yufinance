import "server-only";

import { and, eq, isNotNull, isNull } from "drizzle-orm";

import { db } from "@/db";
import { financialAccounts, workspaces } from "@/db/schema";
import type { FinancialAccount } from "@/db/schema/core/financial-accounts";
import type { CreateFinancialAccountData } from "../application/create-financial-account.schema";
import type { UpdateFinancialAccountData } from "../application/update-financial-account.schema";

export async function getWorkspaceForFinancialAccountCreation(workspaceId: string): Promise<{
  id: string;
  currency: string;
} | null> {
  const result = await db
    .select({
      id: workspaces.id,
      currency: workspaces.currency,
    })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  return result[0] ?? null;
}

export async function createFinancialAccountRecord(input: {
  workspaceId: string;
  currency: string;
  financialAccount: CreateFinancialAccountData;
}): Promise<{
  id: string;
}> {
  const result = await db
    .insert(financialAccounts)
    .values({
      workspaceId: input.workspaceId,
      name: input.financialAccount.name,
      type: input.financialAccount.type,
      initialBalance: input.financialAccount.initialBalance,
      currency: input.currency,
    })
    .returning({
      id: financialAccounts.id,
    });

  const createdFinancialAccount = result[0];

  if (!createdFinancialAccount) {
    throw new Error("Financial account was not created.");
  }

  return createdFinancialAccount;
}

export async function findActiveFinancialAccountById(
  financialAccountId: string,
  workspaceId: string,
): Promise<FinancialAccount | null> {
  const result = await db
    .select()
    .from(financialAccounts)
    .where(
      and(
        eq(financialAccounts.id, financialAccountId),
        eq(financialAccounts.workspaceId, workspaceId),
        isNull(financialAccounts.archivedAt),
      ),
    )
    .limit(1);

  return result[0] ?? null;
}

export async function listActiveFinancialAccountsByWorkspace(workspaceId: string) {
  return db
    .select()
    .from(financialAccounts)
    .where(
      and(eq(financialAccounts.workspaceId, workspaceId), isNull(financialAccounts.archivedAt)),
    )
    .orderBy(financialAccounts.createdAt);
}

export async function updateActiveFinancialAccountRecord(input: {
  financialAccountId: string;
  workspaceId: string;
  financialAccount: UpdateFinancialAccountData;
}): Promise<FinancialAccount | null> {
  const result = await db
    .update(financialAccounts)
    .set({
      name: input.financialAccount.name,
      type: input.financialAccount.type,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(financialAccounts.id, input.financialAccountId),
        eq(financialAccounts.workspaceId, input.workspaceId),
        isNull(financialAccounts.archivedAt),
      ),
    )
    .returning();

  return result[0] ?? null;
}

export async function archiveActiveFinancialAccountRecord(input: {
  financialAccountId: string;
  workspaceId: string;
}): Promise<FinancialAccount | null> {
  const result = await db
    .update(financialAccounts)
    .set({
      archivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(financialAccounts.id, input.financialAccountId),
        eq(financialAccounts.workspaceId, input.workspaceId),
        isNull(financialAccounts.archivedAt),
      ),
    )
    .returning();

  return result[0] ?? null;
}

export async function restoreArchivedFinancialAccountRecord(input: {
  financialAccountId: string;
  workspaceId: string;
}): Promise<FinancialAccount | null> {
  const result = await db
    .update(financialAccounts)
    .set({
      archivedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(financialAccounts.id, input.financialAccountId),
        eq(financialAccounts.workspaceId, input.workspaceId),
        isNotNull(financialAccounts.archivedAt),
      ),
    )
    .returning();

  return result[0] ?? null;
}

export async function listArchivedFinancialAccountsByWorkspace(workspaceId: string) {
  return db
    .select()
    .from(financialAccounts)
    .where(
      and(eq(financialAccounts.workspaceId, workspaceId), isNotNull(financialAccounts.archivedAt)),
    )
    .orderBy(financialAccounts.createdAt);
}
