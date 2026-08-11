export type TransactionViewDto = {
  id: string;

  description: string;

  type: "INCOME" | "EXPENSE";

  amount: string;

  occurredAt: Date;

  canceledAt: Date | null;

  categoryName: string;

  financialAccountName: string;
};
