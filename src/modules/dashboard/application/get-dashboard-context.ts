import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { type DashboardPeriod, resolveDashboardPeriod } from "./dashboard-period";

export type DashboardContext = {
  workspaceId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
};

export type GetDashboardContextResult =
  | {
      success: true;
      context: DashboardContext;
    }
  | {
      success: false;
      message: string;
    };

export async function getDashboardContext(input: {
  workspaceId: string;
  period?: DashboardPeriod;
  defaultPeriod?: DashboardPeriod;
  referenceDate?: Date;
}): Promise<GetDashboardContextResult> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      message: "Você precisa estar autenticado para continuar.",
    };
  }

  const membership = await findWorkspaceMembership(currentUser.id, input.workspaceId);

  if (!membership) {
    return {
      success: false,
      message: "Você não possui acesso a este espaço financeiro.",
    };
  }

  const { startDate, endDate } = resolveDashboardPeriod(
    input.period ?? input.defaultPeriod ?? "CURRENT_MONTH",
    input.referenceDate ?? new Date(),
  );

  return {
    success: true,
    context: {
      workspaceId: input.workspaceId,
      userId: currentUser.id,
      startDate,
      endDate,
    },
  };
}
