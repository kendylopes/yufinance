import { pgEnum } from "drizzle-orm/pg-core";

export const workspaceTypeEnum = pgEnum("workspace_type", ["PERSONAL", "COUPLE", "FAMILY"]);

export const workspaceRoleEnum = pgEnum("workspace_role", ["OWNER", "ADMIN", "MEMBER", "VIEWER"]);

export const themePreferenceEnum = pgEnum("theme_preference", ["LIGHT", "DARK", "SYSTEM"]);

export const weekStartEnum = pgEnum("week_start", ["SUNDAY", "MONDAY"]);
