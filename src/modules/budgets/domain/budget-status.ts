export const budgetStatus = {
  ON_TRACK: "ON_TRACK",
  NEAR_LIMIT: "NEAR_LIMIT",
  EXCEEDED: "EXCEEDED",
} as const;

export type BudgetStatus = (typeof budgetStatus)[keyof typeof budgetStatus];
