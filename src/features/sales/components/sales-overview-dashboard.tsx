"use client";

import { useMemo, useState } from "react";
import { Filter, Users } from "lucide-react";
import { CustomSelect } from "@/src/components/ui/custom-select";
import {
  useSalesOverview,
  usePerformanceStaffList,
  useStaffPerformance,
} from "../hooks/use-sales-performance";
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

const ALL_STAFF_VALUE = "__all__";

export function SalesOverviewDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("this_month");
  const [staffId, setStaffId] = useState<string>(ALL_STAFF_VALUE);

  const isStaffScoped = staffId !== ALL_STAFF_VALUE;

  const { data: staffList } = usePerformanceStaffList();

  const overviewQuery = useSalesOverview(!isStaffScoped ? period : undefined);
  const staffQuery = useStaffPerformance(
    isStaffScoped ? staffId : null,
    isStaffScoped ? period : undefined
  );

  const { data, isLoading, isError, refetch } = isStaffScoped
    ? staffQuery
    : overviewQuery;

  const staffOptions = useMemo(
    () => [
      { value: ALL_STAFF_VALUE, label: "All Staff (Dealership)" },
      ...(staffList ?? []).map((s) => ({ value: s.id, label: s.name })),
    ],
    [staffList]
  );

  const totals = data?.totals ?? { enquiries: 0, bookings: 0, deliveries: 0 };
  const trend = data?.trend ?? { bucket: "month", points: [] };
  const staffName = data?.staff?.name;

  const hasActivity =
    totals.enquiries > 0 || totals.bookings > 0 || totals.deliveries > 0;

  const resolvedDateLabel = resolvePeriodDateLabel(data?.period);

  if (isError) {
    return <PerformanceErrorState onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return <PerformanceLoadingState />;
  }

  return (
    <div className="space-y-4 font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* PERIOD + STAFF SELECTOR HEADER BAR                            */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-card p-2.5 sm:p-3 rounded-xl border border-line/60">
        <div className="flex flex-col sm:flex-row gap-2.5">
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
          <CustomSelect
            options={staffOptions}
            value={staffId}
            onChange={(val) => setStaffId(val)}
            icon={<Users className="h-3.5 w-3.5 text-accent" />}
            labelPrefix="Staff:"
          />
        </div>

        <PerformanceDateBadge label={resolvedDateLabel} />
      </div>

      {isStaffScoped && staffName && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-xs font-bold text-accent">
          <Users className="h-3.5 w-3.5" />
          <span>Showing: {staffName}</span>
        </div>
      )}

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
