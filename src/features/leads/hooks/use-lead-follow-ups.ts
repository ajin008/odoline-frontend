import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { leadApi } from "../api/lead-api";
import { queryKeys } from "@/src/lib/query-keys";
import type {
  ScheduleFollowUpPayload,
  UpdateFollowUpPayload,
} from "../types/lead-types";
import { toast } from "sonner";

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

/**
 * Fetch follow-ups list for a lead. Cached under queryKeys.leads.followUps(id).
 */
export function useLeadFollowUps(id: string) {
  return useQuery({
    queryKey: queryKeys.leads.followUps(id),
    queryFn: () => leadApi.getFollowUps(id),
    enabled: !!id,
  });
}

/**
 * Schedule a new follow-up for a lead.
 * Invalidates lead follow-ups, lead detail (for next_follow_up), leads list, and action list.
 */
export function useScheduleFollowUp(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ScheduleFollowUpPayload) =>
      leadApi.scheduleFollowUp(id, payload),
    onSuccess: () => {
      toast.success("Follow-up scheduled");
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.followUps(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.followUps.all,
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to schedule follow-up";
      toast.error(message);
    },
  });
}

/**
 * Update a follow-up (DONE, CANCEL, RESCHEDULE).
 * Invalidates lead follow-ups, lead detail, leads list, and action list.
 */
export function useUpdateFollowUp(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fuId,
      payload,
    }: {
      fuId: string;
      payload: UpdateFollowUpPayload;
    }) => leadApi.updateFollowUp(id, fuId, payload),
    onSuccess: () => {
      toast.success("Follow-up updated");
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.followUps(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.followUps.all,
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to update follow-up";
      toast.error(message);
    },
  });
}

/**
 * Fetch staff action list follow-ups for a bucket ('today' | 'overdue' | 'upcoming').
 */
export function useActionFollowUps(bucket: "today" | "overdue" | "upcoming") {
  return useQuery({
    queryKey: queryKeys.followUps.actionList(bucket),
    queryFn: () => leadApi.getActionFollowUps(bucket),
  });
}
