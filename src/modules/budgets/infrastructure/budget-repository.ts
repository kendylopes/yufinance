import "server-only";

import { and, asc, eq, gte, isNotNull, isNull, lt, sql } from "drizzle-orm";

import { db } from "@/db";
import { budgets } from "@/db/schema/core/budgets";
import { categories } from "@/db/schema/core/categories";
import { transactions } from "@/db/schema/core/transactions";

export type Budget = typeof budgets.$inferSelect;

export type CreateBudgetRecordInput = {
  workspaceId: string;
  categoryId: string;
  month: number;
  year: number;
  plannedAmount: string;
};

export type UpdateBudgetRecordInput = {
  budgetId: string;
  workspaceId: string;
  plannedAmount: string;
  month: number;
  year: number;
};

export async function createBudgetRecord(input: CreateBudgetRecordInput): Promise<Budget> {
  const [budget] = await db
    .insert(budgets)
    .values({
      workspaceId: input.workspaceId,
      categoryId: input.categoryId,
      month: input.month,
      year: input.year,
      plannedAmount: input.plannedAmount,
    })
    .returning();

  if (!budget) {
    throw new Error("Não foi possível criar o orçamento.");
  }

  return budget;
}

export async function findActiveBudgetById(
  budgetId: string,
  workspaceId: string,
): Promise<Budget | null> {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.id, budgetId),
        eq(budgets.workspaceId, workspaceId),
        isNull(budgets.archivedAt),
      ),
    )
    .limit(1);

  return budget ?? null;
}

export async function findArchivedBudgetById(
  budgetId: string,
  workspaceId: string,
): Promise<Budget | null> {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.id, budgetId),
        eq(budgets.workspaceId, workspaceId),
        isNotNull(budgets.archivedAt),
      ),
    )
    .limit(1);

  return budget ?? null;
}

export async function findActiveBudgetByCategoryAndPeriod(input: {
  workspaceId: string;
  categoryId: string;
  month: number;
  year: number;
}): Promise<Budget | null> {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.workspaceId, input.workspaceId),
        eq(budgets.categoryId, input.categoryId),
        eq(budgets.month, input.month),
        eq(budgets.year, input.year),
        isNull(budgets.archivedAt),
      ),
    )
    .limit(1);

  return budget ?? null;
}

export async function findActiveExpenseCategoryById(
  categoryId: string,
  workspaceId: string,
): Promise<{
  id: string;
  name: string;
} | null> {
  const [category] = await db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.workspaceId, workspaceId),
        eq(categories.type, "EXPENSE"),
        isNull(categories.archivedAt),
      ),
    )
    .limit(1);

  return category ?? null;
}

export async function listActiveBudgetsByWorkspaceAndPeriod(input: {
  workspaceId: string;
  month: number;
  year: number;
}) {
  return db
    .select({
      id: budgets.id,
      workspaceId: budgets.workspaceId,
      categoryId: budgets.categoryId,
      categoryName: categories.name,
      month: budgets.month,
      year: budgets.year,
      plannedAmount: budgets.plannedAmount,
      archivedAt: budgets.archivedAt,
      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
    })
    .from(budgets)
    .innerJoin(categories, eq(categories.id, budgets.categoryId))
    .where(
      and(
        eq(budgets.workspaceId, input.workspaceId),
        eq(budgets.month, input.month),
        eq(budgets.year, input.year),
        isNull(budgets.archivedAt),
      ),
    )
    .orderBy(asc(categories.name));
}

export async function listArchivedBudgetsByWorkspace(workspaceId: string) {
  return db
    .select({
      id: budgets.id,
      workspaceId: budgets.workspaceId,
      categoryId: budgets.categoryId,
      categoryName: categories.name,
      month: budgets.month,
      year: budgets.year,
      plannedAmount: budgets.plannedAmount,
      archivedAt: budgets.archivedAt,
      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
    })
    .from(budgets)
    .innerJoin(categories, eq(categories.id, budgets.categoryId))
    .where(and(eq(budgets.workspaceId, workspaceId), isNotNull(budgets.archivedAt)))
    .orderBy(asc(budgets.year), asc(budgets.month), asc(categories.name));
}

export async function updateActiveBudgetRecord(
  input: UpdateBudgetRecordInput,
): Promise<Budget | null> {
  const [budget] = await db
    .update(budgets)
    .set({
      plannedAmount: input.plannedAmount,
      month: input.month,
      year: input.year,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(budgets.id, input.budgetId),
        eq(budgets.workspaceId, input.workspaceId),
        isNull(budgets.archivedAt),
      ),
    )
    .returning();

  return budget ?? null;
}

export async function archiveActiveBudgetRecord(input: {
  budgetId: string;
  workspaceId: string;
}): Promise<Budget | null> {
  const [budget] = await db
    .update(budgets)
    .set({
      archivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(budgets.id, input.budgetId),
        eq(budgets.workspaceId, input.workspaceId),
        isNull(budgets.archivedAt),
      ),
    )
    .returning();

  return budget ?? null;
}

export async function restoreArchivedBudgetRecord(input: {
  budgetId: string;
  workspaceId: string;
}): Promise<Budget | null> {
  const [budget] = await db
    .update(budgets)
    .set({
      archivedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(budgets.id, input.budgetId),
        eq(budgets.workspaceId, input.workspaceId),
        isNotNull(budgets.archivedAt),
      ),
    )
    .returning();

  return budget ?? null;
}
export type BudgetProgressRecord = {
  id: string;
  workspaceId: string;
  categoryId: string;
  categoryName: string;
  month: number;
  year: number;
  plannedAmount: string;
  spentAmount: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function listActiveBudgetProgressRecords(input: {
  workspaceId: string;
  month: number;
  year: number;
  startDate: Date;
  endDate: Date;
}): Promise<BudgetProgressRecord[]> {
  return db
    .select({
      id: budgets.id,
      workspaceId: budgets.workspaceId,
      categoryId: budgets.categoryId,
      categoryName: categories.name,
      month: budgets.month,
      year: budgets.year,
      plannedAmount: budgets.plannedAmount,

      spentAmount: sql<string>`
        coalesce(
          sum(${transactions.amount}),
          0
        )
      `,

      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
    })
    .from(budgets)
    .innerJoin(categories, eq(categories.id, budgets.categoryId))
    .leftJoin(
      transactions,
      and(
        eq(transactions.workspaceId, budgets.workspaceId),
        eq(transactions.categoryId, budgets.categoryId),
        eq(transactions.type, "EXPENSE"),
        isNull(transactions.canceledAt),
        gte(transactions.occurredAt, input.startDate),
        lt(transactions.occurredAt, input.endDate),
      ),
    )
    .where(
      and(
        eq(budgets.workspaceId, input.workspaceId),
        eq(budgets.month, input.month),
        eq(budgets.year, input.year),
        isNull(budgets.archivedAt),
      ),
    )
    .groupBy(budgets.id, categories.id, categories.name)
    .orderBy(asc(categories.name));
}
export async function getBudgetProgressRecordById(input: {
  workspaceId: string;
  budgetId: string;
  startDate: Date;
  endDate: Date;
}): Promise<BudgetProgressRecord | null> {
  const [record] = await db
    .select({
      id: budgets.id,
      workspaceId: budgets.workspaceId,
      categoryId: budgets.categoryId,
      categoryName: categories.name,
      month: budgets.month,
      year: budgets.year,
      plannedAmount: budgets.plannedAmount,

      spentAmount: sql<string>`
        coalesce(sum(${transactions.amount}),0)
      `,

      createdAt: budgets.createdAt,
      updatedAt: budgets.updatedAt,
    })
    .from(budgets)
    .innerJoin(categories, eq(categories.id, budgets.categoryId))
    .leftJoin(
      transactions,
      and(
        eq(transactions.workspaceId, budgets.workspaceId),
        eq(transactions.categoryId, budgets.categoryId),
        eq(transactions.type, "EXPENSE"),
        isNull(transactions.canceledAt),
        gte(transactions.occurredAt, input.startDate),
        lt(transactions.occurredAt, input.endDate),
      ),
    )
    .where(
      and(
        eq(budgets.id, input.budgetId),
        eq(budgets.workspaceId, input.workspaceId),
        isNull(budgets.archivedAt),
      ),
    )
    .groupBy(budgets.id, categories.id, categories.name);

  return record ?? null;
}
