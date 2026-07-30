import "server-only";

import { getCurrentUser } from "@/modules/identity/application/get-current-user";
import { findWorkspaceMembership } from "@/modules/workspace/infrastructure/workspace-repository";

import { canManageCategories } from "../domain/category-permissions";
import { createCategoryRecord } from "../infrastructure/category-repository";
import { type CreateCategoryInput, createCategorySchema } from "./create-category.schema";

export type CreateCategoryResult =
  | {
      success: true;
      categoryId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createCategory(input: {
  workspaceId: string;
  data: CreateCategoryInput;
}): Promise<CreateCategoryResult> {
  const validation = createCategorySchema.safeParse(input.data);

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

  if (!canManageCategories(membership.role)) {
    return {
      success: false,
      message: "Você não possui permissão para criar categorias.",
    };
  }

  try {
    const createdCategory = await createCategoryRecord({
      workspaceId: input.workspaceId,
      name: validation.data.name,
      type: validation.data.type,
    });

    return {
      success: true,
      categoryId: createdCategory.id,
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível criar a categoria. Tente novamente.",
    };
  }
}
