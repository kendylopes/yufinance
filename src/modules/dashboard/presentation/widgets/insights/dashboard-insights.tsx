"use client";

import { useId } from "react";

import type {
  DashboardInsightDto,
  DashboardInsightSeverity,
} from "../../../application/dashboard-insights.dto";

type DashboardInsightsProps = {
  insights: DashboardInsightDto[];
};

export function DashboardInsights({ insights }: DashboardInsightsProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="rounded-xl border bg-card p-6">
      <header className="space-y-1">
        <h2 id={titleId} className="text-lg font-semibold">
          Insights financeiros
        </h2>

        <p className="text-sm text-muted-foreground">
          Informações relevantes identificadas no período.
        </p>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </section>
  );
}

type InsightCardProps = {
  insight: DashboardInsightDto;
};

function InsightCard({ insight }: InsightCardProps) {
  return (
    <article className={`rounded-lg border p-4 ${getSeverityClassName(insight.severity)}`}>
      <div className="space-y-2">
        <p className="font-medium">{insight.title}</p>

        <p className="text-sm">{insight.description}</p>
      </div>
    </article>
  );
}

function getSeverityClassName(severity: DashboardInsightSeverity) {
  switch (severity) {
    case "success":
      return "border-green-600/30 bg-green-600/10 text-green-700 dark:text-green-400";

    case "warning":
      return "border-amber-600/30 bg-amber-600/10 text-amber-700 dark:text-amber-400";

    case "info":
      return "border-blue-600/30 bg-blue-600/10 text-blue-700 dark:text-blue-400";
  }
}
