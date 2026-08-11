"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { useId, useTransition } from "react";

import type { DashboardPeriod } from "../../../application/dashboard-period";
import type { DashboardPeriodOptionDto } from "../../../application/dashboard-period-option.dto";

type PeriodFilterProps = {
  value: DashboardPeriod;
  options: readonly DashboardPeriodOptionDto[];
};

export function PeriodFilter({ value, options }: PeriodFilterProps) {
  const selectId = useId();

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const period = event.target.value as DashboardPeriod;

    const params = new URLSearchParams(searchParams.toString());

    params.set("period", period);

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="text-sm font-medium">
        Período
      </label>

      <select
        id={selectId}
        value={value}
        onChange={handleChange}
        disabled={isPending}
        aria-busy={isPending}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-wait disabled:opacity-60 md:w-64"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
