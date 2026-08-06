// features/settings/hooks/use-config.ts
import { useQuery } from "@tanstack/react-query";
import { configApi } from "../api/config-api";
import { queryKeys } from "@/src/lib/query-keys";

export function useConfig() {
  return useQuery({
    queryKey: queryKeys.config,
    queryFn: configApi.get,
    staleTime: 5 * 60 * 1000,
  });
}
