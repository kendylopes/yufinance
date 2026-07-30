import { sql } from "drizzle-orm";
import { check, index, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { categoryTypeEnum } from "./enums";
import { workspaces } from "./workspaces";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),

    name: varchar("name", {
      length: 60,
    }).notNull(),

    type: categoryTypeEnum("type").notNull(),

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
    index("categories_workspace_id_idx").on(table.workspaceId),

    index("categories_workspace_archived_at_idx").on(table.workspaceId, table.archivedAt),

    index("categories_workspace_type_idx").on(table.workspaceId, table.type),

    uniqueIndex("categories_workspace_type_name_unique_idx").using(
      "btree",
      table.workspaceId,
      table.type,
      sql`lower(trim(${table.name}))`,
    ),

    check("categories_name_length_check", sql`char_length(trim(${table.name})) >= 2`),
  ],
);

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
