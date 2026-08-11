export type RecentTransactionDto = {
  id: string;

  description: string;

  category: string;

  financialAccount: string;

  type: "INCOME" | "EXPENSE";

  amount: string;

  occurredAt: Date;

  canceled: boolean;
};
