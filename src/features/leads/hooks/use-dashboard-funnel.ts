"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/query-keys";
import { leadApi } from "../api/lead-api";

export function useDashboardFunnel() {
  return useQuery({
    queryKey: queryKeys.leads.dashboardFunnel,
    queryFn: () => leadApi.getDashboardFunnel(),
  });
}
