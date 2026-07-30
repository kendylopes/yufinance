import "server-only";

import { and, asc, eq, isNotNull, isNull } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema/core/categories";

export type Category = typeof categories.$inferSelect;

export type CreateCategoryRecordInput = {
  workspaceId: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

export type UpdateActiveCategoryRecordInput = {
  workspaceId: string;
  categoryId: string;
  category: {
    name: string;
  };
};

export async function createCategoryRecord(input: CreateCategoryRecordInput): Promise<Category> {
  const [category] = await db
    .insert(categories)
    .values({
      workspaceId: input.workspaceId,
      name: input.name,
      type: input.type,
    })
    .returning();

  if (!category) {
    throw new Error("Não foi possível criar a categoria.");
  }

  return category;
}

export async function findActiveCategoriesByWorkspaceId(workspaceId: string): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.workspaceId, workspaceId), isNull(categories.archivedAt)))
    .orderBy(asc(categories.type), asc(categories.name));
}

export async function findArchivedCategoriesByWorkspaceId(
  workspaceId: string,
): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.workspaceId, workspaceId), isNotNull(categories.archivedAt)))
    .orderBy(asc(categories.type), asc(categories.name));
}

export async function findActiveCategoryById(
  categoryId: string,
  workspaceId: string,
): Promise<Category | null> {
  const [category] = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.workspaceId, workspaceId),
        isNull(categories.archivedAt),
      ),
    )
    .limit(1);

  return category ?? null;
}

export async function findArchivedCategoryById(
  categoryId: string,
  workspaceId: string,
): Promise<Category | null> {
  const [category] = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.workspaceId, workspaceId),
        isNotNull(categories.archivedAt),
      ),
    )
    .limit(1);

  return category ?? null;
}

export async function updateActiveCategoryRecord(
  input: UpdateActiveCategoryRecordInput,
): Promise<Category | null> {
  const [category] = await db
    .update(categories)
    .set({
      name: input.category.name,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(categories.id, input.categoryId),
        eq(categories.workspaceId, input.workspaceId),
        isNull(categories.archivedAt),
      ),
    )
    .returning();

  return category ?? null;
}

export async function archiveActiveCategoryRecord(input: {
  workspaceId: string;
  categoryId: string;
}): Promise<Category | null> {
  const [category] = await db
    .update(categories)
    .set({
      archivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(categories.id, input.categoryId),
        eq(categories.workspaceId, input.workspaceId),
        isNull(categories.archivedAt),
      ),
    )
    .returning();

  return category ?? null;
}

export async function restoreArchivedCategoryRecord(input: {
  workspaceId: string;
  categoryId: string;
}): Promise<Category | null> {
  const [category] = await db
    .update(categories)
    .set({
      archivedAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(categories.id, input.categoryId),
        eq(categories.workspaceId, input.workspaceId),
        isNotNull(categories.archivedAt),
      ),
    )
    .returning();

  return category ?? null;
}
