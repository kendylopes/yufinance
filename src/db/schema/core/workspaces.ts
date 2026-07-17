import { sql } from "drizzle-orm";
import { char, check, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { workspaceTypeEnum } from "./enums";

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 120,
    }).notNull(),

    type: workspaceTypeEnum("type").notNull().default("PERSONAL"),

    currency: char("currency", {
      length: 3,
    })
      .notNull()
      .default("BRL"),

    timezone: varchar("timezone", {
      length: 100,
    })
      .notNull()
      .default("America/Sao_Paulo"),

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
    check("workspaces_name_length_check", sql`char_length(trim(${table.name})) >= 2`),

    check("workspaces_currency_format_check", sql`${table.currency} ~ '^[A-Z]{3}$'`),
  ],
);

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
