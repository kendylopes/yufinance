import { sql } from "drizzle-orm";
import {
  char,
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { financialAccountTypeEnum } from "./enums";
import { workspaces } from "./workspaces";

export const financialAccounts = pgTable(
  "financial_accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "restrict",
      }),

    name: varchar("name", {
      length: 80,
    }).notNull(),

    type: financialAccountTypeEnum("type").notNull(),

    initialBalance: numeric("initial_balance", {
      precision: 19,
      scale: 4,
    })
      .notNull()
      .default("0"),

    currency: char("currency", {
      length: 3,
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
    index("financial_accounts_workspace_id_idx").on(table.workspaceId),

    index("financial_accounts_workspace_archived_at_idx").on(table.workspaceId, table.archivedAt),

    check("financial_accounts_name_length_check", sql`char_length(trim(${table.name})) >= 2`),

    check("financial_accounts_currency_format_check", sql`${table.currency} ~ '^[A-Z]{3}$'`),
  ],
);

export type FinancialAccount = typeof financialAccounts.$inferSelect;
export type NewFinancialAccount = typeof financialAccounts.$inferInsert;
