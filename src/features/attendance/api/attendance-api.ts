import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type {
  TodayAttendanceState,
  ClockInPayload,
  ClockOutPayload,
  AttendanceOverviewData,
  StaffHeatmapData,
} from "../types/attendance-types";

export const attendanceApi = {
  /** Fetch today's attendance state for current staff member */
  async getTodayState(): Promise<TodayAttendanceState> {
    const res = await apiClient.get(endpoints.attendance.today);
    return res.data.data;
  },

  /** Clock in with coordinates */
  async clockIn(payload: ClockInPayload): Promise<TodayAttendanceState> {
    const res = await apiClient.post(endpoints.attendance.clockIn, payload);
    return res.data.data;
  },

  /** Clock out with coordinates */
  async clockOut(payload: ClockOutPayload): Promise<TodayAttendanceState> {
    const res = await apiClient.post(endpoints.attendance.clockOut, payload);
    return res.data.data;
  },

  /** Fetch attendance overview analytics for a given date (owner-only) */
  async getOverview(date?: string): Promise<AttendanceOverviewData> {
    const res = await apiClient.get(endpoints.attendance.overview(date));
    return res.data.data;
  },

  /** Fetch monthly attendance heatmap for a specific staff member (owner-only) */
  async getStaffHeatmap(
    staffId: string,
    month?: string
  ): Promise<StaffHeatmapData> {
    const res = await apiClient.get(
      endpoints.attendance.staffHeatmap(staffId, month)
    );
    return res.data.data;
  },
};
