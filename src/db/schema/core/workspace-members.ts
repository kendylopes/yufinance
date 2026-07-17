import { sql } from "drizzle-orm";
import { check, index, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "../auth";
import { workspaceRoleEnum } from "./enums";
import { workspaces } from "./workspaces";

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, {
        onDelete: "cascade",
      }),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),

    role: workspaceRoleEnum("role").notNull().default("MEMBER"),

    joinedAt: timestamp("joined_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),

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
      name: "workspace_members_pk",
      columns: [table.workspaceId, table.userId],
    }),

    index("workspace_members_user_id_idx").on(table.userId),

    index("workspace_members_workspace_role_idx").on(table.workspaceId, table.role),

    check("workspace_members_joined_at_check", sql`${table.joinedAt} <= ${table.createdAt}`),
  ],
);

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
