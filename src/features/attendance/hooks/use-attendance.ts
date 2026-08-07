import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { attendanceApi } from "../api/attendance-api";
import type { ClockInPayload, ClockOutPayload } from "../types/attendance-types";
import { queryKeys } from "@/src/lib/query-keys";
import { toast } from "sonner";

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
  };
}

export function useTodayAttendance() {
  return useQuery({
    queryKey: queryKeys.attendance.today,
    queryFn: () => attendanceApi.getTodayState(),
    staleTime: 30000,
  });
}

export function useAttendanceActions() {
  const queryClient = useQueryClient();

  const invalidateToday = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.attendance.today });
  };

  const clockIn = useMutation({
    mutationFn: (payload: ClockInPayload) => attendanceApi.clockIn(payload),
    onSuccess: (data) => {
      toast.success("Clocked in successfully!");
      queryClient.setQueryData(queryKeys.attendance.today, data);
      invalidateToday();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const code = err.response?.data?.error?.code;
      const message = err.response?.data?.error?.message;

      if (code === "OUTSIDE_GEOFENCE") {
        toast.error("You must be at the showroom to clock in.");
      } else if (code === "GEOFENCE_NOT_CONFIGURED") {
        toast.error("Showroom geofence location is not configured by owner yet.");
      } else if (code === "ALREADY_CLOCKED_IN") {
        toast.error("You have already clocked in today.");
      } else {
        toast.error(message || "Failed to clock in.");
      }
    },
  });

  const clockOut = useMutation({
    mutationFn: (payload: ClockOutPayload) => attendanceApi.clockOut(payload),
    onSuccess: (data) => {
      toast.success("Clocked out successfully!");
      queryClient.setQueryData(queryKeys.attendance.today, data);
      invalidateToday();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const code = err.response?.data?.error?.code;
      const message = err.response?.data?.error?.message;

      if (code === "OUTSIDE_GEOFENCE") {
        toast.error("You must be at the showroom to clock out.");
      } else if (code === "GEOFENCE_NOT_CONFIGURED") {
        toast.error("Showroom geofence location is not configured by owner yet.");
      } else if (code === "NOT_CLOCKED_IN") {
        toast.error("You haven't clocked in today.");
      } else if (code === "ALREADY_CLOCKED_OUT") {
        toast.error("You have already clocked out today.");
      } else {
        toast.error(message || "Failed to clock out.");
      }
    },
  });

  return {
    clockIn,
    clockOut,
  };
}
