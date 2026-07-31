import Link from "next/link";
import { redirect } from "next/navigation";

import { listArchivedCategories } from "@/modules/categories/application/list-archived-categories";
import { listCategories } from "@/modules/categories/application/list-categories";
import { ArchiveCategoryButton } from "@/modules/categories/presentation/archive-category-button";
import { CreateCategoryForm } from "@/modules/categories/presentation/create-category-form";
import { RestoreCategoryButton } from "@/modules/categories/presentation/restore-category-button";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

const categoryTypeLabels = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
} as const;

export default async function CategoriesPage() {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const workspaceId = workspaceState.workspaceId;

  const [activeCategoriesResult, archivedCategoriesResult] = await Promise.all([
    listCategories(workspaceId),
    listArchivedCategories(workspaceId),
  ]);

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <p className="text-sm">Gerencie as categorias usadas para organizar receitas e despesas.</p>
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Categorias ativas</h2>
          {activeCategoriesResult.success && (
            <p className="text-sm">
              {formatCategoryCount(activeCategoriesResult.categories.length)}
            </p>
          )}
        </div>

        {!activeCategoriesResult.success && (
          <p className="text-sm" role="alert">
            {activeCategoriesResult.message}
          </p>
        )}

        {activeCategoriesResult.success && activeCategoriesResult.categories.length === 0 && (
          <div className="rounded-xl border p-6">
            <p className="font-medium">Nenhuma categoria cadastrada.</p>
            <p className="mt-1 text-sm">Crie sua primeira categoria usando o formulário abaixo.</p>
          </div>
        )}

        {activeCategoriesResult.success && activeCategoriesResult.categories.length > 0 && (
          <div className="space-y-3">
            {activeCategoriesResult.categories.map((category) => (
              <article key={category.id} className="rounded-xl border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm">{categoryTypeLabels[category.type]}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/categories/${category.id}/edit`}
                        className="text-sm underline"
                      >
                        Editar
                      </Link>
                      <ArchiveCategoryButton
                        workspaceId={workspaceId}
                        categoryId={category.id}
                        categoryName={category.name}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border p-6">
        <div className="mb-6 space-y-1">
          <h2 className="text-lg font-semibold">Nova categoria</h2>
          <p className="text-sm">
            Informe o nome e escolha se a categoria é de receita ou despesa.
          </p>
        </div>
        <CreateCategoryForm workspaceId={workspaceId} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Categorias arquivadas</h2>
          {archivedCategoriesResult.success && (
            <p className="text-sm">
              {formatArchivedCategoryCount(archivedCategoriesResult.categories.length)}
            </p>
          )}
        </div>

        {!archivedCategoriesResult.success && (
          <p className="text-sm" role="alert">
            {archivedCategoriesResult.message}
          </p>
        )}

        {archivedCategoriesResult.success && archivedCategoriesResult.categories.length === 0 && (
          <p className="text-sm">Nenhuma categoria arquivada.</p>
        )}

        {archivedCategoriesResult.success && archivedCategoriesResult.categories.length > 0 && (
          <div className="space-y-3">
            {archivedCategoriesResult.categories.map((category) => (
              <article key={category.id} className="rounded-xl border p-5">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm">{categoryTypeLabels[category.type]}</p>
                  </div>
                  <RestoreCategoryButton
                    workspaceId={workspaceId}
                    categoryId={category.id}
                    categoryName={category.name}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function formatCategoryCount(count: number) {
  return count === 1 ? "1 categoria cadastrada" : `${count} categorias cadastradas`;
}

function formatArchivedCategoryCount(count: number) {
  return count === 1 ? "1 categoria arquivada" : `${count} categorias arquivadas`;
}
