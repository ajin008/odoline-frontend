"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { CustomSelect } from "@/src/components/ui/custom-select";
import { useMyPerformance } from "../hooks/use-sales-performance";
import {
  PERIOD_OPTIONS,
  PeriodKey,
  PerformanceKpiCards,
  PerformanceTrendChart,
  PerformanceErrorState,
  PerformanceLoadingState,
  PerformanceDateBadge,
  resolvePeriodDateLabel,
} from "./performance-shared";

export function StaffMyPerformance() {
  const [period, setPeriod] = useState<PeriodKey>("this_month");

  const { data, isLoading, isError, refetch } = useMyPerformance(period);

  const totals = data?.totals ?? { enquiries: 0, bookings: 0, deliveries: 0 };
  const trend = data?.trend ?? { bucket: "month", points: [] };
  const staffName = data?.staff?.name;

  const hasActivity =
    totals.enquiries > 0 || totals.bookings > 0 || totals.deliveries > 0;

  const resolvedDateLabel = resolvePeriodDateLabel(data?.period);

  if (isError) {
    return (
      <PerformanceErrorState
        message="Failed to load your performance data"
        onRetry={() => refetch()}
      />
    );
  }

  if (isLoading) {
    return <PerformanceLoadingState />;
  }

  return (
    <div className="space-y-4 font-sans select-none">
      <div className="space-y-1">
        <h2 className="text-sm sm:text-base font-bold text-ink font-heading">
          {staffName ? `Your performance, ${staffName}` : "Your performance"}
        </h2>
        <p className="text-xs text-ink-subtle">
          Your own enquiries, bookings, and deliveries for the selected
          period.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PERIOD SELECTOR HEADER BAR                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-card p-2.5 sm:p-3 rounded-xl border border-line/60">
        <CustomSelect
          options={PERIOD_OPTIONS.map((opt) => ({
            value: opt.key,
            label: opt.label,
          }))}
          value={period}
          onChange={(val) => setPeriod(val as PeriodKey)}
          icon={<Filter className="h-3.5 w-3.5 text-accent" />}
          labelPrefix="Period Filter:"
        />

        <PerformanceDateBadge label={resolvedDateLabel} />
      </div>

      <PerformanceKpiCards totals={totals} />
      <PerformanceTrendChart trend={trend} />

      {!hasActivity && (
        <p className="text-center text-[11px] text-ink-subtle -mt-1">
          No enquiries, bookings, or deliveries recorded in this period.
        </p>
      )}
    </div>
  );
}
