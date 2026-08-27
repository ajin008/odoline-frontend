import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingApi } from "../api/booking-api";
import type { CreateBookingPayload } from "../types/booking-types";
import { queryKeys } from "@/src/lib/query-keys";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingApi.create(payload),
    onSuccess: (_, variables) => {
      toast.success("Prebooking created");
      queryClient.invalidateQueries({ queryKey: queryKeys.booking.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.detail(variables.lead_id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { error?: { code?: string; message?: string } } };
      };
      const errObj = axiosErr?.response?.data?.error;
      const code = errObj?.code;
      const message = errObj?.message || "Failed to create prebooking";

      if (code === "CAR_ALREADY_BOOKED") {
        toast.error(
          "This car was just booked under another deal — pick a different car."
        );
      } else {
        toast.error(message);
      }
    },
  });
}
