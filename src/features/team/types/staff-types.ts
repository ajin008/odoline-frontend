export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: "sales" | "owner" | "cro";
  position: string | null;
  gender: "male" | "female" | "other" | null;
  address: string | null;
  joined_on: string | null;
  department_id: string | null;
  department_name: string | null;
  shift_start?: string | null;
  shift_end?: string | null;
  weekly_holiday?: string | null;
  photo_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateStaffPayload {
  name: string;
  phone: string;
  pin: string;
  role?: "sales" | "cro";
  position?: string | null;
  gender?: string | null;
  address?: string | null;
  department_id?: string | null;
  joined_on?: string | null;
}

export interface UpdateStaffPayload {
  name?: string;
  phone?: string;
  position?: string | null;
  gender?: string | null;
  address?: string | null;
  department_id?: string | null;
  joined_on?: string | null;
}

export interface ResetStaffPinPayload {
  new_pin: string;
}
