import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingApi } from "../api/booking-api";
import type {
  CreateBookingPayload,
  CancelBookingPayload,
  EditAgreementPayload,
  SettleDeliverPayload,
} from "../types/booking-types";
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

export function useEditAgreement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: EditAgreementPayload;
    }) => bookingApi.editAgreement(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Agreement updated");
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.booking.all });
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { error?: { code?: string; message?: string } } };
      };
      const errObj = axiosErr?.response?.data?.error;
      const code = errObj?.code;
      const message = errObj?.message || "Failed to update agreement details";

      if (code === "BOOKING_TERMINAL_FROZEN") {
        toast.error(
          "This booking is closed/cancelled — details can't be edited."
        );
      } else if (code === "BOOKING_NOT_FOUND") {
        toast.error("Booking not found or not assigned to your account.");
      } else {
        toast.error(message);
      }
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CancelBookingPayload;
    }) => bookingApi.cancel(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.list("active"),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.list("closed"),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.booking.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { error?: { code?: string; message?: string } } };
      };
      const errObj = axiosErr?.response?.data?.error;
      const code = errObj?.code;
      const message = errObj?.message || "Failed to cancel booking";

      if (code === "INVALID_REFUND_AMOUNT") {
        toast.error(
          "Invalid refund amount. Refund cannot be negative or exceed total advance paid."
        );
      } else if (code === "INVALID_BOOKING_TRANSITION") {
        toast.error(
          "This booking cannot be cancelled because it is no longer in prebooked status."
        );
      } else if (code === "BOOKING_NOT_FOUND") {
        toast.error("Booking not found or not assigned to your account.");
      } else {
        toast.error(message);
      }
    },
  });
}

export function useSettleDeliver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SettleDeliverPayload;
    }) => bookingApi.settleDeliver(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Settlement complete — vehicle delivered");
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.list("active"),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.booking.list("closed"),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.booking.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.cars.all });
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { error?: { code?: string; message?: string } } };
      };
      const errObj = axiosErr?.response?.data?.error;
      const code = errObj?.code;
      const message = errObj?.message || "Failed to complete settlement";

      if (code === "BALANCE_NOT_CLEARED") {
        toast.error(message || "Full balance not collected — payment required before delivery.");
      } else if (code === "INVALID_BOOKING_TRANSITION") {
        toast.error(
          "This booking cannot be settled because it is not in prebooked or offer stage."
        );
      } else if (code === "BOOKING_NOT_FOUND") {
        toast.error("Booking not found or not assigned to your account.");
      } else {
        toast.error(message);
      }
    },
  });
}


