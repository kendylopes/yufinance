import { describe, expect, it } from "vitest";

import { type CategoryRole, canManageCategories, canReadCategories } from "./category-permissions";

describe("category permissions", () => {
  describe("canReadCategories", () => {
    const cases: Array<{
      role: CategoryRole;
      expected: boolean;
    }> = [
      { role: "OWNER", expected: true },
      { role: "ADMIN", expected: true },
      { role: "MEMBER", expected: true },
      { role: "VIEWER", expected: true },
    ];

    it.each(cases)("returns $expected for $role", ({ role, expected }) => {
      expect(canReadCategories(role)).toBe(expected);
    });
  });

  describe("canManageCategories", () => {
    const cases: Array<{
      role: CategoryRole;
      expected: boolean;
    }> = [
      { role: "OWNER", expected: true },
      { role: "ADMIN", expected: true },
      { role: "MEMBER", expected: false },
      { role: "VIEWER", expected: false },
    ];

    it.each(cases)("returns $expected for $role", ({ role, expected }) => {
      expect(canManageCategories(role)).toBe(expected);
    });
  });
});
