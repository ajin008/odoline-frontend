// features/leads/hooks/use-cro-at-risk.ts
import { useQuery } from "@tanstack/react-query";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * Hook to fetch dealership-wide CRO At-Risk Summary metrics.
 * Accessible by role='cro' or 'owner'.
 */
export function useCroAtRisk() {
  return useQuery({
    queryKey: queryKeys.leads.croAtRisk,
    queryFn: () => leadApi.getCroAtRisk(),
    staleTime: 30 * 1000,
  });
}
