"use client";

import { useQuery } from "@tanstack/react-query";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";

export function useMyAtRisk() {
  return useQuery({
    queryKey: queryKeys.leads.myAtRisk,
    queryFn: () => leadApi.getMyAtRisk(),
    staleTime: 30 * 1000,
  });
}
