import type { BudgetStatus } from "../domain/budget-status";

export type BudgetDto = {
  id: string;
  workspaceId: string;
  categoryId: string;
  categoryName: string;
  month: number;
  year: number;

  plannedAmount: string;
  spentAmount: string;
  remainingAmount: string;

  percentage: number;
  status: BudgetStatus;

  createdAt: Date;
  updatedAt: Date;
};
