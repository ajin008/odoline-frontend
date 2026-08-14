import { useInfiniteQuery } from "@tanstack/react-query";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";
import type { LeadPriority } from "../types/lead-types";

const PAGE_SIZE = 16;

export interface UseInfiniteLeadsParams {
  status?: "active" | "won" | "lost";
  priority?: LeadPriority;
  search?: string;
}

/**
 * Cursor-paginated leads list as infinite-scroll server state.
 * Accepts optional status, priority, and search filters.
 * The query key includes { status, priority, search } so switching tabs/filters/search terms caches separately.
 */
export function useInfiniteLeads(params: UseInfiniteLeadsParams = {}) {
  const { status = "active", priority, search } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.leads.infinite({ status, priority, search }),
    queryFn: ({ pageParam }) =>
      leadApi.getList({
        status,
        priority,
        search,
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.next_cursor ?? undefined,
  });
}
