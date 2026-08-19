import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { staffApi } from "../api/staff-api";
import type {
  CreateStaffPayload,
  UpdateStaffPayload,
  ResetStaffPinPayload,
} from "../types/staff-types";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";

interface ApiErrorPayload {
  error?: {
    message?: string;
  };
}

export function useStaffActions() {
  const queryClient = useQueryClient();

  const invalidateStaff = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.staff.all });
  };

  const createStaff = useMutation({
    mutationFn: (payload: CreateStaffPayload) => staffApi.create(payload),
    onSuccess: (data) => {
      toast.success(`Staff member "${data.name}" created successfully`);
      invalidateStaff();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to create staff member"
      );
    },
  });

  const updateStaff = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStaffPayload;
    }) => staffApi.update(id, payload),
    onSuccess: (data) => {
      toast.success(`Staff profile "${data.name}" updated successfully`);
      invalidateStaff();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to update staff profile"
      );
    },
  });

  const resetPin = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ResetStaffPinPayload;
    }) => staffApi.resetPin(id, payload),
    onSuccess: (data) => {
      toast.success(`PIN reset successfully for "${data.name}"`);
      invalidateStaff();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(err.response?.data?.error?.message || "Failed to reset PIN");
    },
  });

  const deactivateStaff = useMutation({
    mutationFn: (id: string) => staffApi.deactivate(id),
    onSuccess: (data) => {
      toast.success(`Staff member "${data.name}" deactivated`);
      invalidateStaff();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message ||
          "Failed to deactivate staff member"
      );
    },
  });

  const activateStaff = useMutation({
    mutationFn: (id: string) => staffApi.activate(id),
    onSuccess: (data) => {
      toast.success(`Staff member "${data.name}" reactivated`);
      invalidateStaff();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message ||
          "Failed to reactivate staff member"
      );
    },
  });

  const updatePhoto = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      staffApi.updatePhoto(id, file),
    onSuccess: (data) => {
      toast.success(`Photo updated for "${data.name}"`);
      invalidateStaff();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to update staff photo"
      );
    },
  });

  const removePhoto = useMutation({
    mutationFn: (id: string) => staffApi.removePhoto(id),
    onSuccess: (data) => {
      toast.success(`Profile photo removed for "${data.name}"`);
      invalidateStaff();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to remove staff photo"
      );
    },
  });

  return {
    createStaff,
    updateStaff,
    updatePhoto,
    removePhoto,
    resetPin,
    deactivateStaff,
    activateStaff,
  };
}
