import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageFinancialAccounts } from "../domain/financial-account-permissions";
import {
  createFinancialAccountRecord,
  getWorkspaceForFinancialAccountCreation,
} from "../infrastructure/financial-account-repository";
import {
  type CreateFinancialAccountInput,
  createFinancialAccountSchema,
} from "./create-financial-account.schema";

export type CreateFinancialAccountResult =
  | {
      success: true;
      financialAccountId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createFinancialAccount(input: {
  workspaceId: string;
  data: CreateFinancialAccountInput;
}): Promise<CreateFinancialAccountResult> {
  const validation = createFinancialAccountSchema.safeParse(input.data);

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
      message: "Você não possui permissão para criar contas financeiras.",
    };
  }

  try {
    const workspace = await getWorkspaceForFinancialAccountCreation(input.workspaceId);

    if (!workspace) {
      return {
        success: false,
        message: "O espaço financeiro informado não foi encontrado.",
      };
    }

    const createdFinancialAccount = await createFinancialAccountRecord({
      workspaceId: workspace.id,
      currency: workspace.currency,
      financialAccount: validation.data,
    });

    return {
      success: true,
      financialAccountId: createdFinancialAccount.id,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível criar a conta financeira. Tente novamente.",
    };
  }
}
