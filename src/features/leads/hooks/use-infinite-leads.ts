import { useInfiniteQuery } from "@tanstack/react-query";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";
import type { LeadPriority } from "../types/lead-types";

const PAGE_SIZE = 16;

export interface UseInfiniteLeadsParams {
  status?: "active" | "won" | "lost";
  priority?: LeadPriority;
}

/**
 * Cursor-paginated leads list as infinite-scroll server state.
 * Accepts optional status and priority filters.
 * The query key includes { status, priority } so switching tabs/filters caches separately.
 */
export function useInfiniteLeads(params: UseInfiniteLeadsParams = {}) {
  const { status = "active", priority } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.leads.infinite({ status, priority }),
    queryFn: ({ pageParam }) =>
      leadApi.getList({
        status,
        priority,
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_cursor ?? undefined,
  });
}
