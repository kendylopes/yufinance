import { sql } from "drizzle-orm";
import {
  check,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { categoryTypeEnum } from "./enums";
import { financialAccounts } from "./financial-accounts";
import { workspaces } from "./workspaces";

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "restrict",
      }),

    financialAccountId: uuid("financial_account_id")
      .notNull()
      .references(() => financialAccounts.id, {
        onDelete: "restrict",
      }),

    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, {
        onDelete: "restrict",
      }),

    type: categoryTypeEnum("type").notNull(),

    description: varchar("description", {
      length: 120,
    }).notNull(),

    amount: numeric("amount", {
      precision: 19,
      scale: 4,
    }).notNull(),

    occurredAt: timestamp("occurred_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),

    notes: text("notes"),

    canceledAt: timestamp("canceled_at", {
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
    index("transactions_workspace_id_idx").on(table.workspaceId),

    index("transactions_workspace_occurred_at_idx").on(table.workspaceId, table.occurredAt),

    index("transactions_workspace_canceled_at_idx").on(table.workspaceId, table.canceledAt),

    index("transactions_financial_account_id_idx").on(table.financialAccountId),

    index("transactions_category_id_idx").on(table.categoryId),

    check(
      "transactions_description_length_check",
      sql`char_length(trim(${table.description})) >= 2`,
    ),

    check("transactions_amount_positive_check", sql`${table.amount} > 0`),
  ],
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
