export type FinancialAccountOption = {
  id: string;
  name: string;
};

export type CategoryOption = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE";
};

export type TransactionFormDto = {
  id: string;

  financialAccountId: string;

  categoryId: string;

  type: "INCOME" | "EXPENSE";

  description: string;

  amount: string;

  occurredAt: Date;

  notes: string | null;
};
