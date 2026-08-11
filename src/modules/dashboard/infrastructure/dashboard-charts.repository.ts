import "server-only";

import { and, eq, gte, isNull, lt, sql } from "drizzle-orm";

import { db } from "@/db";
import { transactions } from "@/db/schema";

export type IncomeExpenseChartRecord = {
  income: string;
  expense: string;
};

export async function getIncomeExpenseChartRecord(input: {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
}): Promise<IncomeExpenseChartRecord> {
  const [result] = await db
    .select({
      income: sql<string>`
        coalesce(
          sum(case
            when ${transactions.type} = 'INCOME'
            then ${transactions.amount}
            else 0
          end),
          0
        )
      `,
      expense: sql<string>`
        coalesce(
          sum(case
            when ${transactions.type} = 'EXPENSE'
            then ${transactions.amount}
            else 0
          end),
          0
        )
      `,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.workspaceId, input.workspaceId),
        isNull(transactions.canceledAt),
        gte(transactions.occurredAt, input.startDate),
        lt(transactions.occurredAt, input.endDate),
      ),
    );

  return {
    income: result?.income ?? "0",
    expense: result?.expense ?? "0",
  };
}
