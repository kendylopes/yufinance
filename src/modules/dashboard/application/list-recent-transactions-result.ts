import type { RecentTransactionDto } from "./recent-transaction.dto";

export type ListRecentTransactionsResult =
  | {
      success: true;
      transactions: RecentTransactionDto[];
    }
  | {
      success: false;
      message: string;
    };
