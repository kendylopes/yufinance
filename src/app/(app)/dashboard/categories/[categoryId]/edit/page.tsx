import { redirect } from "next/navigation";

import { getCategory } from "@/modules/categories/application/get-category";
import { UpdateCategoryForm } from "@/modules/categories/presentation/update-category-form";
import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

type EditCategoryPageProps = {
  params: Promise<{
    categoryId: string;
  }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const workspaceState = await getWorkspaceEntryState();

  if (workspaceState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (workspaceState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  const { categoryId } = await params;
  const result = await getCategory({
    workspaceId: workspaceState.workspaceId,
    categoryId,
  });

  if (!result.success) {
    redirect("/dashboard/categories");
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Editar categoria</h1>
        <p className="text-sm">Atualize o nome da categoria.</p>
      </header>

      <section className="rounded-xl border p-6">
        <UpdateCategoryForm
          workspaceId={workspaceState.workspaceId}
          categoryId={result.category.id}
          defaultValues={{ name: result.category.name }}
        />
      </section>
    </main>
  );
}
