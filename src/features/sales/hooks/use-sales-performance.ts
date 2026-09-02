"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/query-keys";
import { performanceApi } from "../api/performance-api";

/** Dealership-wide totals + trend for the selected period (owner only). */
export function useSalesOverview(period?: string) {
  return useQuery({
    queryKey: queryKeys.salesPerformance.overview(period),
    queryFn: () => performanceApi.getOverview(period),
  });
}

/** Active sales/cro reps for the owner's staff selector dropdown. */
export function usePerformanceStaffList() {
  return useQuery({
    queryKey: queryKeys.salesPerformance.staffList,
    queryFn: () => performanceApi.getStaffList(),
  });
}

/** One staff member's totals + trend for the selected period (owner only). */
export function useStaffPerformance(staffId: string | null, period?: string) {
  return useQuery({
    queryKey: queryKeys.salesPerformance.staffDetail(staffId ?? "", period),
    queryFn: () => performanceApi.getStaffDetail(staffId as string, period),
    enabled: !!staffId,
  });
}

/** The logged-in rep's own totals + trend (sales/cro self-scoped). */
export function useMyPerformance(period?: string) {
  return useQuery({
    queryKey: queryKeys.salesPerformance.me(period),
    queryFn: () => performanceApi.getMe(period),
  });
}
