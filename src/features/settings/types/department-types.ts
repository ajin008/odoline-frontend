export interface Department {
  id: string;
  name: string;
  shift_start: string; // e.g. "09:00:00" or "09:00"
  shift_end: string;   // e.g. "18:00:00" or "18:00"
  weekly_holiday: number; // 0-6 (0=Sunday)
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentPayload {
  name: string;
  shift_start: string;
  shift_end: string;
  weekly_holiday: number;
}

export interface UpdateDepartmentPayload {
  name?: string;
  shift_start?: string;
  shift_end?: string;
  weekly_holiday?: number;
}

export const WEEKLY_HOLIDAY_LABELS: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
