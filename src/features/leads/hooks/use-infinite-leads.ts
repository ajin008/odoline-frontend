import { useInfiniteQuery } from "@tanstack/react-query";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";
import type { LeadPriority } from "../types/lead-types";

const PAGE_SIZE = 16;

export interface UseInfiniteLeadsParams {
  status?: "active" | "won" | "lost";
  priority?: LeadPriority;
  search?: string;
  assigned_to?: string;
}

/**
 * Cursor-paginated leads list as infinite-scroll server state.
 * Accepts optional status, priority, search, and assigned_to staff filters.
 * The query key includes { status, priority, search, assigned_to } so switching tabs/filters/search terms caches separately.
 */
export function useInfiniteLeads(params: UseInfiniteLeadsParams = {}) {
  const { status = "active", priority, search, assigned_to } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.leads.infinite({ status, priority, search, assigned_to }),
    queryFn: ({ pageParam }) =>
      leadApi.getList({
        status,
        priority,
        search,
        assigned_to,
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_cursor ?? undefined,
  });
}
