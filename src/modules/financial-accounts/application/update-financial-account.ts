import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageFinancialAccounts } from "../domain/financial-account-permissions";
import { updateActiveFinancialAccountRecord } from "../infrastructure/financial-account-repository";
import {
  type UpdateFinancialAccountInput,
  updateFinancialAccountSchema,
} from "./update-financial-account.schema";

export type UpdateFinancialAccountResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function updateFinancialAccount(input: {
  workspaceId: string;
  financialAccountId: string;
  data: UpdateFinancialAccountInput;
}): Promise<UpdateFinancialAccountResult> {
  const validation = updateFinancialAccountSchema.safeParse(input.data);

  if (!validation.success) {
    return {
      success: false,
      message: "Os dados informados não são válidos.",
    };
  }

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

  if (!canManageFinancialAccounts(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para editar contas financeiras.",
    };
  }

  try {
    const financialAccount = await updateActiveFinancialAccountRecord({
      workspaceId: input.workspaceId,
      financialAccountId: input.financialAccountId,
      financialAccount: validation.data,
    });

    if (!financialAccount) {
      return {
        success: false,
        message: "Conta financeira não encontrada.",
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível atualizar a conta financeira. Tente novamente.",
    };
  }
}
