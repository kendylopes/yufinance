import { describe, expect, it } from "vitest";

import { canManageTransactions, canReadTransactions } from "./transaction-permissions";

describe("transaction-permissions", () => {
  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)("permite leitura para %s", (role) => {
    expect(canReadTransactions(role)).toBe(true);
  });

  it.each(["OWNER", "ADMIN", "MEMBER"] as const)("permite gerenciamento para %s", (role) => {
    expect(canManageTransactions(role)).toBe(true);
  });

  it("nega gerenciamento para VIEWER", () => {
    expect(canManageTransactions("VIEWER")).toBe(false);
  });
});
