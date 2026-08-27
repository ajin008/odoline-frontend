import { useQuery } from "@tanstack/react-query";
import { bookingApi } from "../api/booking-api";
import { queryKeys } from "@/src/lib/query-keys";

/**
 * Fetch single booking detail by ID.
 * Enabled only when booking ID is present.
 */
export function useBooking(id: string) {
  return useQuery({
    queryKey: queryKeys.booking.detail(id),
    queryFn: () => bookingApi.getById(id),
    enabled: Boolean(id),
  });
}
