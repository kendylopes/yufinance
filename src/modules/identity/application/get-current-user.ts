import "server-only";

import { headers } from "next/headers";

import { auth } from "../infrastructure/better-auth";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}
