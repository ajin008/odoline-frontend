"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
 * Fetch unassigned open leads queue for owner.
 */
export function useUnassignedLeads() {
  return useQuery({
    queryKey: queryKeys.leads.unassigned,
    queryFn: () => leadApi.getUnassigned(),
  });
}

/**
 * Reassign lead mutation hook for owner.
 * On success: toast + invalidates unassigned leads, all leads, dashboard funnel, and lead detail queries.
 * On error: surfaces exact backend error message (e.g. INVALID_ASSIGNEE) via toast.
 */
export function useAssignLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) =>
      leadApi.assign(id, assignedTo),
    onSuccess: (_, variables) => {
      toast.success("Lead assigned successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.unassigned,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.dashboardFunnel(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.detail(variables.id),
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to assign lead";
      toast.error(message);
    },
  });
}

/**
 * Fetch active sales staff with their active lead load for owner picker.
 */
export function useStaffLoad() {
  return useQuery({
    queryKey: queryKeys.leads.staffLoad,
    queryFn: () => leadApi.getStaffLoad(),
  });
}

/**
 * Bulk lead assignment mutation hook for owner.
 * On success: toast + invalidates unassigned leads, all leads, dashboard funnel, and staff load queries.
 * On error: surfaces exact backend error message (e.g. INVALID_ASSIGNEE) via toast.
 */
export function useBulkAssign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      assigned_to: string;
      lead_ids?: string[];
      assign_all?: boolean;
      staffName?: string;
    }) =>
      leadApi.bulkAssign({
        assigned_to: payload.assigned_to,
        lead_ids: payload.lead_ids,
        assign_all: payload.assign_all,
      }),
    onSuccess: (data, variables) => {
      const repName = variables.staffName ? ` to ${variables.staffName}` : "";
      if (data.skipped_count > 0) {
        toast.success(
          `Assigned ${data.assigned_count} lead(s)${repName} (${data.skipped_count} were already assigned or unavailable)`
        );
      } else {
        toast.success(`Assigned ${data.assigned_count} lead(s)${repName}`);
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.unassigned,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.dashboardFunnel(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.leads.staffLoad,
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to bulk assign leads";
      toast.error(message);
    },
  });
}

