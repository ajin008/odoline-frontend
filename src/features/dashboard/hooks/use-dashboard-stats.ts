// features/dashboard/hooks/use-dashboard-stats.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * The dashboard's four counts, as server state.
 * Returns { data, isLoading, isError } — the component renders each state.
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: dashboardApi.getStats,
  });
}
