import type { BudgetDto } from "../application/budget.dto";
import { BudgetCard } from "./budget-card";
import { BudgetEmptyState } from "./budget-empty-state";

type BudgetListProps = {
  budgets: BudgetDto[];
};

export function BudgetList({ budgets }: BudgetListProps) {
  if (budgets.length === 0) {
    return <BudgetEmptyState />;
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2" aria-label="Orçamentos">
      {budgets.map((budget) => (
        <BudgetCard key={budget.id} budget={budget} />
      ))}
    </section>
  );
}
