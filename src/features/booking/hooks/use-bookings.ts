import { useInfiniteQuery } from "@tanstack/react-query";
import { bookingApi } from "../api/booking-api";
import { queryKeys } from "@/src/lib/query-keys";
import type { BookingTab } from "../types/booking-types";

const PAGE_SIZE = 16;

export interface UseInfiniteBookingsParams {
  tab?: BookingTab;
  status?: "active" | "closed";
  role?: string;
}

/**
 * Cursor-paginated bookings list as infinite-scroll server state.
 * Accepts tab ('prebooked' | 'delivered' | 'completed' | 'cancelled') and role ('owner' | 'sales' | etc).
 */
export function useInfiniteBookings(params: UseInfiniteBookingsParams = {}) {
  const tab = params.tab || (params.status === "closed" ? "completed" : "prebooked");
  const role = params.role;

  return useInfiniteQuery({
    queryKey: queryKeys.booking.list(tab, role),
    queryFn: ({ pageParam }) =>
      bookingApi.list({
        tab,
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
