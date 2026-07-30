import { describe, expect, it } from "vitest";

import {
  canManageFinancialAccounts,
  canReadFinancialAccounts,
} from "./financial-account-permissions";

describe("Financial Account permissions", () => {
  it.each(["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const)("permite leitura para %s", (role) => {
    expect(canReadFinancialAccounts(role)).toBe(true);
  });

  it.each(["OWNER", "ADMIN"] as const)("permite administração para %s", (role) => {
    expect(canManageFinancialAccounts(role)).toBe(true);
  });

  it.each(["MEMBER", "VIEWER"] as const)("impede administração para %s", (role) => {
    expect(canManageFinancialAccounts(role)).toBe(false);
  });
});
