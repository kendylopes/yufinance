import { sql } from "drizzle-orm";
import { boolean, check, pgTable, primaryKey, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { themePreferenceEnum, weekStartEnum } from "./enums";
import { workspaces } from "./workspaces";

export const workspaceSettings = pgTable(
  "workspace_settings",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),

    locale: varchar("locale", {
      length: 10,
    })
      .notNull()
      .default("pt-BR"),

    theme: themePreferenceEnum("theme").notNull().default("SYSTEM"),

    weekStartsOn: weekStartEnum("week_starts_on").notNull().default("MONDAY"),

    showCents: boolean("show_cents").notNull().default(true),

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
    primaryKey({
      name: "workspace_settings_pk",
      columns: [table.workspaceId],
    }),

    check(
      "workspace_settings_locale_format_check",
      sql`${table.locale} ~ '^[a-z]{2}(-[A-Z]{2})?$'`,
    ),
  ],
);

export type WorkspaceSettings = typeof workspaceSettings.$inferSelect;
export type NewWorkspaceSettings = typeof workspaceSettings.$inferInsert;
