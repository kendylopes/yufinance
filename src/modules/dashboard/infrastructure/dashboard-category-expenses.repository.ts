import "server-only";

import { and, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, transactions } from "@/db/schema";

export type CategoryExpenseRecord = {
  categoryId: string;
  categoryName: string;
  amount: string;
};

export async function getCategoryExpensesRecord(input: {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
}): Promise<CategoryExpenseRecord[]> {
  return db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      amount: sql<string>`
        coalesce(sum(${transactions.amount}), 0)
      `,
    })
    .from(transactions)
    .innerJoin(categories, eq(categories.id, transactions.categoryId))
    .where(
      and(
        eq(transactions.workspaceId, input.workspaceId),
        eq(transactions.type, "EXPENSE"),
        isNull(transactions.canceledAt),
        gte(transactions.occurredAt, input.startDate),
        lte(transactions.occurredAt, input.endDate),
      ),
    )
    .groupBy(categories.id, categories.name)
    .orderBy(desc(sql`sum(${transactions.amount})`));
}
