import { useQuery } from "@tanstack/react-query";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * Single lead by id cached under queryKeys.leads.detail(id).
 * `enabled: !!id` prevents firing before an id is available.
 */
export function useLead(id: string) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id),
    queryFn: () => leadApi.getById(id),
    enabled: !!id,
  });
}
