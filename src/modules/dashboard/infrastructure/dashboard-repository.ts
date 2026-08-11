import "server-only";

import { and, desc, eq, gte, isNull, lt, sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, financialAccounts, transactions, workspaces } from "@/db/schema";

export type DashboardSummaryRecord = {
  currency: string;
  initialBalance: string;
  totalIncome: string;
  totalExpense: string;
  monthlyIncome: string;
  monthlyExpense: string;
  activeAccountsCount: number;
  monthlyTransactionsCount: number;
};

export async function getDashboardSummaryRecord(input: {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
}): Promise<DashboardSummaryRecord | null> {
  const workspaceResult = await db
    .select({
      currency: workspaces.currency,
    })
    .from(workspaces)
    .where(eq(workspaces.id, input.workspaceId))
    .limit(1);

  const workspace = workspaceResult[0];

  if (!workspace) {
    return null;
  }

  const accountsResult = await db
    .select({
      initialBalance: sql<string>`
        coalesce(sum(${financialAccounts.initialBalance}), 0)
      `,
      activeAccountsCount: sql<number>`
        count(*)::int
      `,
    })
    .from(financialAccounts)
    .where(
      and(
        eq(financialAccounts.workspaceId, input.workspaceId),
        isNull(financialAccounts.archivedAt),
      ),
    );

  const totalsResult = await db
    .select({
      totalIncome: sql<string>`
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
      totalExpense: sql<string>`
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
    .where(and(eq(transactions.workspaceId, input.workspaceId), isNull(transactions.canceledAt)));

  const monthlyResult = await db
    .select({
      monthlyIncome: sql<string>`
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
      monthlyExpense: sql<string>`
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
      monthlyTransactionsCount: sql<number>`
        count(*)::int
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

  const accounts = accountsResult[0];
  const totals = totalsResult[0];
  const monthly = monthlyResult[0];

  return {
    currency: workspace.currency,
    initialBalance: accounts?.initialBalance ?? "0",
    totalIncome: totals?.totalIncome ?? "0",
    totalExpense: totals?.totalExpense ?? "0",
    monthlyIncome: monthly?.monthlyIncome ?? "0",
    monthlyExpense: monthly?.monthlyExpense ?? "0",
    activeAccountsCount: accounts?.activeAccountsCount ?? 0,
    monthlyTransactionsCount: monthly?.monthlyTransactionsCount ?? 0,
  };
}
export async function listRecentTransactionsRecord(input: { workspaceId: string; limit?: number }) {
  return db
    .select({
      id: transactions.id,
      description: transactions.description,
      type: transactions.type,
      amount: transactions.amount,
      occurredAt: transactions.occurredAt,
      canceledAt: transactions.canceledAt,
      category: categories.name,
      financialAccount: financialAccounts.name,
    })
    .from(transactions)
    .innerJoin(categories, eq(categories.id, transactions.categoryId))
    .innerJoin(financialAccounts, eq(financialAccounts.id, transactions.financialAccountId))
    .where(eq(transactions.workspaceId, input.workspaceId))
    .orderBy(desc(transactions.occurredAt))
    .limit(input.limit ?? 5);
}
