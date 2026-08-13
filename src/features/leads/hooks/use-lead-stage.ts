import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";
import type { ChangeStagePayload } from "../types/lead-types";
import { toast } from "sonner";

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

/**
 * Change lead stage mutation hook.
 * On success: invalidates lead detail, leads list, activities timeline, and follow-ups.
 * On error: surfaces exact backend error message (e.g. INVALID_STAGE_TRANSITION) via toast.
 */
export function useChangeStage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChangeStagePayload) =>
      leadApi.changeStage(id, payload),
    onSuccess: () => {
      toast.success("Lead stage updated");
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.activities(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.followUps.all,
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to update lead stage";
      toast.error(message);
    },
  });
}

/**
 * Fetch stage history audit log for a lead.
 */
export function useLeadStageHistory(id: string) {
  return useQuery({
    queryKey: queryKeys.leads.stageHistory(id),
    queryFn: () => leadApi.getStageHistory(id),
    enabled: !!id,
  });
}
