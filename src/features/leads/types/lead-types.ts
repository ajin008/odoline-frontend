export type LeadStage =
  | "new"
  | "contacted"
  | "test_drive"
  | "discussion"
  | "won"
  | "lost";

export type LeadPriority = "very_hot" | "hot" | "warm" | "cold";

export type LeadSource =
  | "walk_in"
  | "whatsapp"
  | "phone"
  | "referral"
  | "instagram"
  | "olx"
  | "other";

export type LeadActivityType =
  | "call"
  | "whatsapp"
  | "visit"
  | "note"
  | "stage_change"
  | "priority_change"
  | "reassigned";

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: LeadActivityType;
  note: string | null;
  created_at: string;
  performed_by: {
    id: string;
    name: string;
  };
}

export interface LogActivityPayload {
  type: "call" | "whatsapp" | "visit" | "note";
  note?: string;
}

export interface ChangeStagePayload {
  to_stage: LeadStage;
  won_car_id?: string | null;
  won_price?: string | null;
  lost_reason?: string | null;
  notes?: string | null;
}

export interface LeadStageHistory {
  id: string;
  lead_id: string;
  from_stage: LeadStage | null;
  to_stage: LeadStage;
  notes: string | null;
  created_at: string;
  changed_by: {
    id: string;
    name: string;
  };
}

export type FollowUpStatus = "open" | "done" | "cancelled";
export type FollowUpDueState = "overdue" | "due_today" | "upcoming" | "none";

export interface NextFollowUpInfo {
  id: string;
  due_at: string;
  due_state: FollowUpDueState;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  due_at: string;
  status: FollowUpStatus;
  outcome_note: string | null;
  completed_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  lead?: {
    id: string;
    stage: string;
    priority: LeadPriority;
    customer?: {
      id: string;
      name: string;
      phone: string;
    } | null;
  } | null;
}

export interface ScheduleFollowUpPayload {
  due_at: string;
}

export interface UpdateFollowUpPayload {
  status?: "done" | "cancelled";
  outcome_note?: string | null;
  due_at?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  customer_id: string;
  assigned_to: string | null;
  stage: LeadStage;
  priority: LeadPriority;
  source: LeadSource;
  source_note: string | null;
  budget_min: string | null;
  budget_max: string | null;
  remark: string | null;
  lost_reason: string | null;
  won_car_id: string | null;
  won_price: string | null;
  won_at: string | null;
  lost_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  assigned_rep?: { id: string; name: string } | null;
  next_follow_up?: NextFollowUpInfo | null;
  interested_cars?: import("@/src/features/cars/api/cars-api").Car[] | null;
  won_car?: import("@/src/features/cars/api/cars-api").Car | null;
}

export interface CreateLeadPayload {
  name: string;
  phone: string;
  priority?: LeadPriority;
  source: LeadSource;
  source_note?: string | null;
  budget_min?: string | null;
  budget_max?: string | null;
  remark?: string | null;
  first_follow_up_at?: string | null;
}

export interface FunnelCounts {
  new: number;
  contacted: number;
  test_drive: number;
  discussion: number;
  won: number;
  lost: number;
}

export interface DashboardFunnelPeriod {
  period: string;
  from: string | null;
  to: string | null;
}

export interface DashboardFunnelMetrics {
  new_in_period: number;
  won_in_period: number;
  lost_in_period: number;
  conversion_rate: number;
  total_open: number;
}

export interface DashboardFunnelData {
  period: DashboardFunnelPeriod;
  metrics: DashboardFunnelMetrics;
  funnel: FunnelCounts;
}
