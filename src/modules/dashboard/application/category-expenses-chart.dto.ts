export type CategoryExpensePointDto = {
  categoryId: string;
  categoryName: string;
  amount: string;
  percentage: number;
};

export type CategoryExpensesChartDto = {
  totalExpense: string;
  categories: CategoryExpensePointDto[];
};
