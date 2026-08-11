import { redirect } from "next/navigation";

import { getWorkspaceEntryState } from "@/modules/workspace/application/get-workspace-entry-state";

export default async function HomePage() {
  const entryState = await getWorkspaceEntryState();

  if (entryState.status === "UNAUTHENTICATED") {
    redirect("/login");
  }

  if (entryState.status === "ONBOARDING_REQUIRED") {
    redirect("/onboarding");
  }

  redirect("/dashboard");
}
