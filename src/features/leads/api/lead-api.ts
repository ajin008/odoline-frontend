import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type {
  Lead,
  CreateLeadPayload,
  LeadActivity,
  LogActivityPayload,
  FollowUp,
  ScheduleFollowUpPayload,
  UpdateFollowUpPayload,
  ChangeStagePayload,
  LeadStageHistory,
} from "../types/lead-types";
import type { Car } from "@/src/features/cars/api/cars-api";

export interface LeadsPagination {
  next_cursor: string | null;
  has_more: boolean;
}

export interface LeadsPage {
  data: Lead[];
  pagination: LeadsPagination;
}

export const leadApi = {
  /** POST /api/v1/leads — Create a new customer lead */
  async create(payload: CreateLeadPayload): Promise<Lead> {
    const res = await apiClient.post(endpoints.leads.create, payload);
    return res.data.data;
  },

  /**
   * GET /api/v1/leads — Cursor-paginated leads list.
   * Accepts status ('active' | 'won' | 'lost') and priority ('very_hot' | 'hot' | 'warm' | 'cold').
   * Returns { data: Lead[], pagination: { next_cursor, has_more } }
   */
  async getList(
    params: {
      status?: "active" | "won" | "lost";
      priority?: "very_hot" | "hot" | "warm" | "cold";
      cursor?: string;
      limit?: number;
    } = {}
  ): Promise<LeadsPage> {
    const queryParams: Record<string, string | number> = {};
    if (params.status) queryParams.status = params.status;
    if (params.priority) queryParams.priority = params.priority;
    if (params.cursor) queryParams.cursor = params.cursor;
    if (params.limit) queryParams.limit = params.limit;

    const res = await apiClient.get(endpoints.leads.list, {
      params: Object.keys(queryParams).length ? queryParams : undefined,
    });

    return {
      data: res.data.data,
      pagination: res.data.pagination,
    };
  },

  /** GET /api/v1/leads/:id — Get single lead detail */
  async getById(id: string): Promise<Lead> {
    const res = await apiClient.get(endpoints.leads.detail(id));
    return res.data.data;
  },

  /** GET /api/v1/leads/:id/activities — Get activity timeline */
  async getActivities(id: string): Promise<LeadActivity[]> {
    const res = await apiClient.get(endpoints.leads.activities(id));
    return res.data.data;
  },

  /** POST /api/v1/leads/:id/activities — Log a human activity */
  async logActivity(
    id: string,
    payload: LogActivityPayload
  ): Promise<LeadActivity> {
    const res = await apiClient.post(endpoints.leads.activities(id), payload);
    return res.data.data;
  },

  /** GET /api/v1/leads/:id/follow-ups — List follow-ups for a lead */
  async getFollowUps(id: string): Promise<FollowUp[]> {
    const res = await apiClient.get(endpoints.leads.followUps(id));
    return res.data.data;
  },

  /** POST /api/v1/leads/:id/follow-ups — Schedule a follow-up */
  async scheduleFollowUp(
    id: string,
    payload: ScheduleFollowUpPayload
  ): Promise<FollowUp> {
    const res = await apiClient.post(endpoints.leads.followUps(id), payload);
    return res.data.data;
  },

  /** PATCH /api/v1/leads/:id/follow-ups/:fuId — Update follow-up (DONE, CANCEL, RESCHEDULE) */
  async updateFollowUp(
    id: string,
    fuId: string,
    payload: UpdateFollowUpPayload
  ): Promise<FollowUp> {
    const res = await apiClient.patch(
      endpoints.leads.followUp(id, fuId),
      payload
    );
    return res.data.data;
  },

  // eslint-disable-next-line no-secrets/no-secrets
  /** GET /api/v1/follow-ups?bucket=today|overdue|upcoming — Staff Action List */
  async getActionFollowUps(
    bucket: "today" | "overdue" | "upcoming"
  ): Promise<FollowUp[]> {
    const res = await apiClient.get(endpoints.followUps.list(bucket));
    return res.data.data;
  },

  /** PATCH /api/v1/leads/:id/stage — Change lead's stage */
  async changeStage(id: string, payload: ChangeStagePayload): Promise<Lead> {
    const res = await apiClient.patch(endpoints.leads.stage(id), payload);
    return res.data.data;
  },

  /** GET /api/v1/leads/:id/stage-history — Get audit log of stage transitions */
  async getStageHistory(id: string): Promise<LeadStageHistory[]> {
    const res = await apiClient.get(endpoints.leads.stageHistory(id));
    return res.data.data;
  },

  /** POST /api/v1/leads/:id/cars — Link an interested car */
  async linkCar(id: string, payload: { car_id: string }): Promise<Car> {
    const res = await apiClient.post(endpoints.leads.cars(id), payload);
    return res.data.data;
  },

  /** DELETE /api/v1/leads/:id/cars/:carId — Unlink an interested car */
  async unlinkCar(id: string, carId: string): Promise<{ removed: boolean }> {
    const res = await apiClient.delete(endpoints.leads.car(id, carId));
    return res.data.data;
  },
};
