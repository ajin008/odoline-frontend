import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";
import type { LogActivityPayload } from "../types/lead-types";
import { toast } from "sonner";

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

/**
 * Fetch lead activity timeline. Cached under queryKeys.leads.activities(id).
 */
export function useLeadActivities(id: string) {
  return useQuery({
    queryKey: queryKeys.leads.activities(id),
    queryFn: () => leadApi.getActivities(id),
    enabled: !!id,
  });
}

/**
 * Mutation to log a human activity.
 * On success: toast.success + invalidates queryKeys.leads.activities(id) so timeline refreshes immediately.
 */
export function useLogActivity(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LogActivityPayload) =>
      leadApi.logActivity(id, payload),
    onSuccess: () => {
      toast.success("Activity logged");
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.activities(id),
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to log activity";
      toast.error(message);
    },
  });
}
