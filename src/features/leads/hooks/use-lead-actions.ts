import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { leadApi } from "../api/lead-api";
import type { CreateLeadPayload } from "../types/lead-types";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

export function useLeadActions() {
  const queryClient = useQueryClient();

  const createLead = useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadApi.create(payload),
    onSuccess: (data) => {
      const customerName = data.customer?.name || "Customer";
      toast.success(`Lead created successfully for "${customerName}"`);
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const message =
        err.response?.data?.error?.message || "Failed to create lead";
      toast.error(message);
    },
  });

  return {
    createLead,
  };
}
