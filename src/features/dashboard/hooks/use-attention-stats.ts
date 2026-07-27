// features/dashboard/hooks/use-attention-stats.ts
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * Fetch attention metrics for dashboard: docs_pending and aging_over_60.
 */
export function useAttentionStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.attention,
    queryFn: dashboardApi.getAttention,
  });
}
