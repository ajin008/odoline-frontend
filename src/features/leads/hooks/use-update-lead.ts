"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadApi } from "../api/lead-api";
import type { UpdateLeadPayload } from "../types/lead-types";
import { queryKeys } from "@/src/lib/query-keys";

export function useUpdateLead(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLeadPayload) => leadApi.update(leadId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(leadId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
  });
}
