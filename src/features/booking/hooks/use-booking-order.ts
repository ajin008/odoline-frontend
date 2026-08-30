import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingApi } from "../api/booking-api";
import type { SaveOrderPayload } from "../types/booking-types";
import { queryKeys } from "@/src/lib/query-keys";

export function useBookingOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.booking.order(id),
    queryFn: () => bookingApi.getOrder(id),
    enabled: Boolean(id),
  });
}

export function useSaveOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SaveOrderPayload }) =>
      bookingApi.saveOrder(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Order form saved");
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.order(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.detail(variables.id),
      });
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { error?: { code?: string; message?: string } } };
      };
      const errObj = axiosErr?.response?.data?.error;
      const code = errObj?.code;
      const message = errObj?.message || "Failed to save order form";

      if (code === "BOOKING_TERMINAL_FROZEN") {
        toast.error(
          "This booking is closed/cancelled — the order form can't be changed."
        );
      } else {
        toast.error(message);
      }
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingApi.deleteOrder(id),
    onSuccess: (_, id) => {
      toast.success("Order form removed");
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.order(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.detail(id),
      });
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { error?: { code?: string; message?: string } } };
      };
      const errObj = axiosErr?.response?.data?.error;
      const message = errObj?.message || "Failed to remove order form";
      toast.error(message);
    },
  });
}
