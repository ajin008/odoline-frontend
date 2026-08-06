import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "../types/department-types";

export const departmentApi = {
  async getList(statusFilter: "active" | "inactive" | "all" = "active"): Promise<Department[]> {
    const res = await apiClient.get(endpoints.departments.list, {
      params: { status: statusFilter },
    });
    return res.data.data;
  },

  async getById(id: string): Promise<Department> {
    const res = await apiClient.get(endpoints.departments.detail(id));
    return res.data.data;
  },

  async create(payload: CreateDepartmentPayload): Promise<Department> {
    const res = await apiClient.post(endpoints.departments.create, payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateDepartmentPayload): Promise<Department> {
    const res = await apiClient.patch(endpoints.departments.update(id), payload);
    return res.data.data;
  },

  async deactivate(id: string): Promise<Department> {
    const res = await apiClient.patch(endpoints.departments.deactivate(id));
    return res.data.data;
  },

  async activate(id: string): Promise<Department> {
    const res = await apiClient.patch(endpoints.departments.activate(id));
    return res.data.data;
  },
};
