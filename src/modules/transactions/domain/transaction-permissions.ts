export type TransactionRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export function canReadTransactions(_role: TransactionRole): boolean {
  return true;
}

export function canManageTransactions(role: TransactionRole): boolean {
  return role === "OWNER" || role === "ADMIN" || role === "MEMBER";
}
