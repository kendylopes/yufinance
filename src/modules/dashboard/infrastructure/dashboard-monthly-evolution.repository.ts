import "server-only";

import { and, asc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db";
import { transactions } from "@/db/schema";

export type MonthlyEvolutionRecord = {
  month: string;
  income: string;
  expense: string;
};

export async function getMonthlyEvolutionRecord(input: {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
}): Promise<MonthlyEvolutionRecord[]> {
  return db
    .select({
      month: sql<string>`to_char(date_trunc('month', ${transactions.occurredAt}), 'Mon')`,

      income: sql<string>`
        coalesce(
          sum(
            case
              when ${transactions.type} = 'INCOME'
              then ${transactions.amount}
              else 0
            end
          ),
          0
        )
      `,

      expense: sql<string>`
        coalesce(
          sum(
            case
              when ${transactions.type} = 'EXPENSE'
              then ${transactions.amount}
              else 0
            end
          ),
          0
        )
      `,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.workspaceId, input.workspaceId),
        isNull(transactions.canceledAt),
        sql`${transactions.occurredAt} >= ${input.startDate}`,
        sql`${transactions.occurredAt} <= ${input.endDate}`,
      ),
    )
    .groupBy(sql`date_trunc('month', ${transactions.occurredAt})`)
    .orderBy(asc(sql`date_trunc('month', ${transactions.occurredAt})`));
}
