import { describe, expect, it } from "vitest";

import { canManageBudgets, canReadBudgets } from "./budget-permissions";

describe("Budget permissions", () => {
  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)("permite leitura para %s", (role) => {
    expect(canReadBudgets(role)).toBe(true);
  });

  it.each(["OWNER", "ADMIN"] as const)("permite administração para %s", (role) => {
    expect(canManageBudgets(role)).toBe(true);
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede administração para %s", (role) => {
    expect(canManageBudgets(role)).toBe(false);
  });
});
