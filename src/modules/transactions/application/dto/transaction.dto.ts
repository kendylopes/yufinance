export type TransactionDto = {
  id: string;

  workspaceId: string;

  financialAccountId: string;

  categoryId: string;

  type: "INCOME" | "EXPENSE";

  description: string;

  amount: string;

  occurredAt: Date;

  notes: string | null;

  canceledAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
};
