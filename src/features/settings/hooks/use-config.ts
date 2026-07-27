// features/settings/hooks/use-config.ts
import { useQuery } from "@tanstack/react-query";
import { configApi } from "../api/config-api";

export function useConfig() {
  return useQuery({
    queryKey: ["config"],
    queryFn: configApi.get,
    staleTime: 60 * 60 * 1000, // config rarely changes — cache 1 hour
  });
}
