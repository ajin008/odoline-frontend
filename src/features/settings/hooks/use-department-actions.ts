import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { departmentApi } from "../api/department-api";
import type {
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "../types/department-types";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";

interface ApiErrorPayload {
  error?: {
    message?: string;
  };
}

export function useDepartmentActions() {
  const queryClient = useQueryClient();

  const invalidateDepartments = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
  };

  const createDepartment = useMutation({
    mutationFn: (payload: CreateDepartmentPayload) =>
      departmentApi.create(payload),
    onSuccess: (data) => {
      toast.success(`Department "${data.name}" created successfully`);
      invalidateDepartments();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to create department"
      );
    },
  });

  const updateDepartment = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDepartmentPayload;
    }) => departmentApi.update(id, payload),
    onSuccess: (data) => {
      toast.success(`Department "${data.name}" updated successfully`);
      invalidateDepartments();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to update department"
      );
    },
  });

  const deactivateDepartment = useMutation({
    mutationFn: (id: string) => departmentApi.deactivate(id),
    onSuccess: (data) => {
      toast.success(`Department "${data.name}" deactivated`);
      invalidateDepartments();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to deactivate department"
      );
    },
  });

  const activateDepartment = useMutation({
    mutationFn: (id: string) => departmentApi.activate(id),
    onSuccess: (data) => {
      toast.success(`Department "${data.name}" reactivated`);
      invalidateDepartments();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      toast.error(
        err.response?.data?.error?.message || "Failed to reactivate department"
      );
    },
  });

  return {
    createDepartment,
    updateDepartment,
    deactivateDepartment,
    activateDepartment,
  };
}
