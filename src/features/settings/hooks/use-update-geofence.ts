import { useMutation, useQueryClient } from "@tanstack/react-query";
import { configApi, UpdateGeofencePayload } from "../api/config-api";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";

export function useUpdateGeofence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGeofencePayload) => configApi.updateGeofence(payload),
    onSuccess: (updatedConfig) => {
      toast.success("Showroom geofence location saved successfully");
      queryClient.setQueryData(queryKeys.config, updatedConfig);
      queryClient.invalidateQueries({ queryKey: queryKeys.config });
    },
    onError: () => {
      toast.error("Failed to update showroom geofence");
    },
  });
}
