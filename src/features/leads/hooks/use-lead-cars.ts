import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

/**
 * Link an interested car to a lead.
 * On success: invalidates queryKeys.leads.detail(id) (refreshes interested_cars)
 * AND queryKeys.leads.activities(id) (the link logs a note in timeline).
 * On error: surfaces exact error message (e.g. CAR_ALREADY_LINKED) via toast.
 */
export function useLinkCar(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { car_id: string }) => leadApi.linkCar(id, payload),
    onSuccess: () => {
      toast.success("Interested vehicle linked");
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.activities(id),
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to link vehicle";
      toast.error(message);
    },
  });
}

/**
 * Unlink an interested car from a lead.
 * On success: invalidates queryKeys.leads.detail(id) AND queryKeys.leads.activities(id).
 */
export function useUnlinkCar(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId: string) => leadApi.unlinkCar(id, carId),
    onSuccess: () => {
      toast.success("Interested vehicle removed");
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.activities(id),
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to remove vehicle";
      toast.error(message);
    },
  });
}
