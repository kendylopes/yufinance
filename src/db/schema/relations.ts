import { relations } from "drizzle-orm";

import { user } from "./auth";
import { workspaceMembers, workspaceSettings, workspaces } from "./core";

export const workspaceRelations = relations(workspaces, ({ many, one }) => ({
  members: many(workspaceMembers),

  settings: one(workspaceSettings, {
    fields: [workspaces.id],
    references: [workspaceSettings.workspaceId],
  }),
}));

export const workspaceMemberRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),

  user: one(user, {
    fields: [workspaceMembers.userId],
    references: [user.id],
  }),
}));

export const workspaceSettingsRelations = relations(workspaceSettings, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceSettings.workspaceId],
    references: [workspaces.id],
  }),
}));
