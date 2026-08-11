import { isNull, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { categories } from "./categories";
import { workspaces } from "./workspaces";

export const budgets = pgTable(
  "budgets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "restrict",
      }),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "restrict",
      }),

    month: integer("month").notNull(),

    year: integer("year").notNull(),

    plannedAmount: numeric("planned_amount", {
      precision: 19,
      scale: 4,
    }).notNull(),

    archivedAt: timestamp("archived_at", {
      withTimezone: true,
      mode: "date",
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("budgets_workspace_id_idx").on(table.workspaceId),

    index("budgets_category_id_idx").on(table.categoryId),

    index("budgets_workspace_period_idx").on(table.workspaceId, table.year, table.month),

    index("budgets_workspace_archived_at_idx").on(table.workspaceId, table.archivedAt),

    uniqueIndex("budgets_workspace_category_year_month_active_unique_idx")
      .on(table.workspaceId, table.categoryId, table.year, table.month)
      .where(isNull(table.archivedAt)),

    check("budgets_month_range_check", sql`${table.month} >= 1 and ${table.month} <= 12`),

    check("budgets_year_positive_check", sql`${table.year} >= 2000`),

    check("budgets_planned_amount_positive_check", sql`${table.plannedAmount} > 0`),
  ],
);

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
