"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/src/lib/query-keys";
import { leadApi } from "../api/lead-api";

export function useDashboardFunnel(period?: string) {
  return useQuery({
    queryKey: queryKeys.leads.dashboardFunnel(period),
    queryFn: () => leadApi.getDashboardFunnel(period),
  });
}
