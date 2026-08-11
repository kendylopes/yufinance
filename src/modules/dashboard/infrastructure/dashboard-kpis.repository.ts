import "server-only";

import { and, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, financialAccounts, transactions } from "@/db/schema";

export type DashboardKpisRecord = {
  activeAccountsCount: number;
  activeCategoriesCount: number;
  periodTransactionsCount: number;
  lastMovementAt: Date | null;
};

export async function getDashboardKpisRecord(input: {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
}): Promise<DashboardKpisRecord> {
  const [
    activeAccountsResult,
    activeCategoriesResult,
    periodTransactionsResult,
    lastMovementResult,
  ] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(financialAccounts)
      .where(
        and(
          eq(financialAccounts.workspaceId, input.workspaceId),
          isNull(financialAccounts.archivedAt),
        ),
      ),

    db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(categories)
      .where(and(eq(categories.workspaceId, input.workspaceId), isNull(categories.archivedAt))),

    db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.workspaceId, input.workspaceId),
          isNull(transactions.canceledAt),
          gte(transactions.occurredAt, input.startDate),
          lte(transactions.occurredAt, input.endDate),
        ),
      ),

    db
      .select({
        occurredAt: transactions.occurredAt,
      })
      .from(transactions)
      .where(and(eq(transactions.workspaceId, input.workspaceId), isNull(transactions.canceledAt)))
      .orderBy(desc(transactions.occurredAt))
      .limit(1),
  ]);

  return {
    activeAccountsCount: activeAccountsResult[0]?.count ?? 0,
    activeCategoriesCount: activeCategoriesResult[0]?.count ?? 0,
    periodTransactionsCount: periodTransactionsResult[0]?.count ?? 0,
    lastMovementAt: lastMovementResult[0]?.occurredAt ?? null,
  };
}
