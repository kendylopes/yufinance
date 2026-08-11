import Link from "next/link";
import { redirect } from "next/navigation";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/layout/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ResourceSection } from "@/components/layout/resource-section";
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
      <PageHeader
        title="Categorias"
        description="Gerencie as categorias usadas para organizar receitas e despesas."
      />

      <ResourceSection
        title="Categorias ativas"
        description={
          activeCategoriesResult.success
            ? formatCategoryCount(activeCategoriesResult.categories.length)
            : undefined
        }
      >
        {!activeCategoriesResult.success ? (
          <ErrorState message={activeCategoriesResult.message} />
        ) : activeCategoriesResult.categories.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria cadastrada"
            description="Categorias ajudam a organizar receitas e despesas. Crie sua primeira categoria usando o formulário abaixo."
          />
        ) : (
          <div className="space-y-3">
            {activeCategoriesResult.categories.map((category) => (
              <article key={category.id} className="rounded-xl border p-5">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{category.name}</h3>

                    <p className="text-sm text-muted-foreground">
                      {categoryTypeLabels[category.type]}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/dashboard/categories/${category.id}/edit`}
                      className="text-sm underline underline-offset-4"
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
              </article>
            ))}
          </div>
        )}
      </ResourceSection>

      <ResourceSection
        title="Nova categoria"
        description="Informe o nome e escolha se a categoria é de receita ou despesa."
      >
        <CreateCategoryForm workspaceId={workspaceId} />
      </ResourceSection>

      <ResourceSection
        title="Categorias arquivadas"
        description={
          archivedCategoriesResult.success
            ? formatArchivedCategoryCount(archivedCategoriesResult.categories.length)
            : undefined
        }
      >
        {!archivedCategoriesResult.success ? (
          <ErrorState message={archivedCategoriesResult.message} />
        ) : archivedCategoriesResult.categories.length === 0 ? (
          <EmptyState
            title="Nenhuma categoria arquivada"
            description="As categorias arquivadas aparecerão aqui e poderão ser restauradas."
          />
        ) : (
          <div className="space-y-3">
            {archivedCategoriesResult.categories.map((category) => (
              <article key={category.id} className="rounded-xl border p-5">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{category.name}</h3>

                    <p className="text-sm text-muted-foreground">
                      {categoryTypeLabels[category.type]}
                    </p>
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
      </ResourceSection>
    </main>
  );
}

function formatCategoryCount(count: number) {
  return count === 1 ? "1 categoria cadastrada" : `${count} categorias cadastradas`;
}

function formatArchivedCategoryCount(count: number) {
  return count === 1 ? "1 categoria arquivada" : `${count} categorias arquivadas`;
}
