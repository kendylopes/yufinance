import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { workspaceMembers, workspaceSettings, workspaces } from "@/db/schema";

import type { CreateInitialWorkspaceData } from "../application/create-initial-workspace.schema";

export type WorkspaceMembership = {
  workspaceId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
};

export async function findWorkspaceMembershipByUserId(
  userId: string,
): Promise<{ workspaceId: string } | null> {
  const result = await db
    .select({
      workspaceId: workspaceMembers.workspaceId,
    })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function findWorkspaceMembership(
  userId: string,
  workspaceId: string,
): Promise<WorkspaceMembership | null> {
  const result = await db
    .select({
      workspaceId: workspaceMembers.workspaceId,
      userId: workspaceMembers.userId,
      role: workspaceMembers.role,
    })
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.userId, userId), eq(workspaceMembers.workspaceId, workspaceId)))
    .limit(1);

  return result[0] ?? null;
}

export async function createInitialWorkspaceRecords(input: {
  workspaceId: string;
  userId: string;
  workspace: CreateInitialWorkspaceData;
}) {
  const { workspaceId, userId, workspace } = input;

  await db.batch([
    db.insert(workspaces).values({
      id: workspaceId,
      name: workspace.name,
      type: workspace.type,
    }),

    db.insert(workspaceMembers).values({
      workspaceId,
      userId,
      role: "OWNER",
    }),

    db.insert(workspaceSettings).values({
      workspaceId,
    }),
  ]);
}
