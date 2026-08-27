import { useInfiniteQuery } from "@tanstack/react-query";
import { bookingApi } from "../api/booking-api";
import { queryKeys } from "@/src/lib/query-keys";

const PAGE_SIZE = 16;

export interface UseInfiniteBookingsParams {
  status?: "active" | "closed";
}

/**
 * Cursor-paginated bookings list as infinite-scroll server state.
 * Accepts status ('active' | 'closed').
 */
export function useInfiniteBookings(params: UseInfiniteBookingsParams = {}) {
  const { status = "active" } = params;

  return useInfiniteQuery({
    queryKey: queryKeys.booking.list(status),
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
