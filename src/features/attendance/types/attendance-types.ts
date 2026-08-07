export interface AttendanceRecord {
  id: string;
  staff_id: string;
  date: string;
  clock_in_at: string;
  clock_out_at: string | null;
  clock_in_lat: number | null;
  clock_in_lng: number | null;
  clock_out_lat: number | null;
  clock_out_lng: number | null;
  clock_in_source: string;
  clock_out_source: string | null;
  marked_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type TodayAttendanceStatus =
  | "not_clocked_in"
  | "clocked_in"
  | "clocked_out";

export interface TodayAttendanceState {
  status: TodayAttendanceStatus;
  date: string;
  clock_in_at?: string | null;
  clock_out_at?: string | null;
  record: AttendanceRecord | null;
}

export interface ClockInPayload {
  latitude: number;
  longitude: number;
}

export interface ClockOutPayload {
  latitude: number;
  longitude: number;
}
