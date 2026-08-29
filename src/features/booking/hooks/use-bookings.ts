import { useInfiniteQuery } from "@tanstack/react-query";
import { bookingApi } from "../api/booking-api";
import { queryKeys } from "@/src/lib/query-keys";

const PAGE_SIZE = 16;

export interface UseInfiniteBookingsParams {
  status?: "active" | "closed";
  role?: string;
}

/**
 * Cursor-paginated bookings list as infinite-scroll server state.
 * Accepts status ('active' | 'closed') and role ('owner' | 'sales' | etc).
 */
export function useInfiniteBookings(params: UseInfiniteBookingsParams = {}) {
  const { status = "active", role } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.booking.list(status, role),
    queryFn: ({ pageParam }) =>
      bookingApi.list({
        status,
        cursor: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_more
        ? lastPage.pagination.next_cursor ?? undefined
        : undefined,
  });
}
