import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type {
  StaffMember,
  CreateStaffPayload,
  UpdateStaffPayload,
  ResetStaffPinPayload,
} from "../types/staff-types";

export const staffApi = {
  async getMe(): Promise<StaffMember> {
    const res = await apiClient.get(endpoints.staff.me);
    return res.data.data;
  },

  async getList(statusFilter: "active" | "inactive" | "all" = "active"): Promise<StaffMember[]> {
    const res = await apiClient.get(endpoints.staff.list, {
      params: { status: statusFilter },
    });
    return res.data.data;
  },

  async getById(id: string): Promise<StaffMember> {
    const res = await apiClient.get(endpoints.staff.detail(id));
    return res.data.data;
  },

  async create(payload: CreateStaffPayload): Promise<StaffMember> {
    const res = await apiClient.post(endpoints.staff.create, payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateStaffPayload): Promise<StaffMember> {
    const res = await apiClient.patch(endpoints.staff.update(id), payload);
    return res.data.data;
  },

  async updatePhoto(id: string, file: File): Promise<StaffMember> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.patch(
      endpoints.staff.updatePhoto(id),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.data;
  },

  async resetPin(id: string, payload: ResetStaffPinPayload): Promise<StaffMember> {
    const res = await apiClient.patch(endpoints.staff.resetPin(id), payload);
    return res.data.data;
  },

  async deactivate(id: string): Promise<StaffMember> {
    const res = await apiClient.patch(endpoints.staff.deactivate(id));
    return res.data.data;
  },

  async activate(id: string): Promise<StaffMember> {
    const res = await apiClient.patch(endpoints.staff.activate(id));
    return res.data.data;
  },
};
