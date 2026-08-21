import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { attendanceApi } from "../api/attendance-api";
import type {
  ClockInPayload,
  ClockOutPayload,
  ManualAttendancePayload,
} from "../types/attendance-types";
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

export function useAttendanceOverview(date?: string) {
  return useQuery({
    queryKey: queryKeys.attendance.overview(date),
    queryFn: () => attendanceApi.getOverview(date),
    staleTime: 30000,
  });
}

export function useStaffHeatmap(staffId: string, month?: string) {
  return useQuery({
    queryKey: queryKeys.attendance.staffHeatmap(staffId, month),
    queryFn: () => attendanceApi.getStaffHeatmap(staffId, month),
    enabled: Boolean(staffId),
    staleTime: 30000,
  });
}

export function useMyHeatmap(month?: string) {
  return useQuery({
    queryKey: queryKeys.attendance.meHeatmap(month),
    queryFn: () => attendanceApi.getMyHeatmap(month),
    staleTime: 30000,
  });
}

export function useUpsertManualAttendance(selectedDate: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ManualAttendancePayload) =>
      attendanceApi.upsertManual(payload),
    onSuccess: (_, variables) => {
      toast.success("Attendance updated successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.overview(selectedDate),
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance", "staff", variables.staff_id, "heatmap"],
      });
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const code = err.response?.data?.error?.code;
      const message = err.response?.data?.error?.message;

      if (code === "FUTURE_DATE_NOT_ALLOWED") {
        toast.error("Cannot record or edit attendance for a future date.");
      } else if (code === "INVALID_ATTENDANCE_TIMES") {
        toast.error("Clock-out time must be after clock-in time.");
      } else if (code === "CLOCK_IN_REQUIRED") {
        toast.error(
          "Clock-in time is required when creating a new attendance record."
        );
      } else {
        toast.error(message || "Failed to update attendance record.");
      }
    },
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
      toast.success("Clocked in successfully!", { id: "attendance-clock-action" });
      queryClient.setQueryData(queryKeys.attendance.today, data);
      invalidateToday();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const code = err.response?.data?.error?.code;
      const message = err.response?.data?.error?.message;

      if (code === "TOO_EARLY") {
        toast.error(message || "It is too early to clock in for your shift.", {
          id: "attendance-clock-action",
        });
      } else if (code === "OUTSIDE_GEOFENCE") {
        toast.error("You must be at the showroom to clock in.", {
          id: "attendance-clock-action",
        });
      } else if (code === "GEOFENCE_NOT_CONFIGURED") {
        toast.error("Showroom geofence location is not configured by owner yet.", {
          id: "attendance-clock-action",
        });
      } else if (code === "ALREADY_CLOCKED_IN") {
        toast.error("You have already clocked in today.", {
          id: "attendance-clock-action",
        });
      } else {
        toast.error(message || "Failed to clock in.", {
          id: "attendance-clock-action",
        });
      }
    },
  });

  const clockOut = useMutation({
    mutationFn: (payload: ClockOutPayload) => attendanceApi.clockOut(payload),
    onSuccess: (data) => {
      toast.success("Clocked out successfully!", { id: "attendance-clock-action" });
      queryClient.setQueryData(queryKeys.attendance.today, data);
      invalidateToday();
    },
    onError: (err: AxiosError<ApiErrorPayload>) => {
      const code = err.response?.data?.error?.code;
      const message = err.response?.data?.error?.message;

      if (code === "OUTSIDE_GEOFENCE") {
        toast.error("You must be at the showroom to clock out.", {
          id: "attendance-clock-action",
        });
      } else if (code === "GEOFENCE_NOT_CONFIGURED") {
        toast.error("Showroom geofence location is not configured by owner yet.", {
          id: "attendance-clock-action",
        });
      } else if (code === "NOT_CLOCKED_IN") {
        toast.error("You haven't clocked in today.", {
          id: "attendance-clock-action",
        });
      } else if (code === "ALREADY_CLOCKED_OUT") {
        toast.error("You have already clocked out today.", {
          id: "attendance-clock-action",
        });
      } else {
        toast.error(message || "Failed to clock out.", {
          id: "attendance-clock-action",
        });
      }
    },
  });

  return {
    clockIn,
    clockOut,
  };
}
