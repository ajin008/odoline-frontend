import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";

export interface RefurbishmentItem {
  id: string;
  car_id: string;
  item_name: string;
  item_type: string;
  cost: string;
  vendor_type: "inhouse" | "outside";
  vendor_name?: string | null;
  status: "pending" | "in_progress" | "done";
  bill_url?: string | null;
  bill_file_name?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateRefurbItemPayload {
  item_name: string;
  item_type?: string;
  cost: string;
  vendor_type?: "inhouse" | "outside";
  vendor_name?: string;
  status?: "pending" | "in_progress" | "done";
  bill?: File | null;
}

export const refurbishmentApi = {
  async getList(carId: string): Promise<RefurbishmentItem[]> {
    const res = await apiClient.get(endpoints.cars.refurbItems(carId));
    return res.data.data;
  },

  async create(
    carId: string,
    data: CreateRefurbItemPayload
  ): Promise<RefurbishmentItem> {
    const formData = new FormData();
    formData.append("item_name", data.item_name);
    formData.append("item_type", data.item_type || "predefined");
    formData.append("cost", data.cost);
    formData.append("vendor_type", data.vendor_type || "inhouse");
    if (data.vendor_name) formData.append("vendor_name", data.vendor_name);
    if (data.bill) formData.append("file", data.bill); // <-- Append optional bill file

    const res = await apiClient.post(
      endpoints.cars.refurbItems(carId),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data.data;
  },

  async update(
    itemId: string,
    data: Partial<CreateRefurbItemPayload>
  ): Promise<RefurbishmentItem> {
    const res = await apiClient.patch(
      endpoints.refurbItems.update(itemId),
      data
    );
    return res.data.data;
  },

  async remove(itemId: string): Promise<void> {
    await apiClient.delete(endpoints.refurbItems.remove(itemId));
  },

  async getBillUrl(itemId: string): Promise<string> {
    const res = await apiClient.get(`/refurbishment/items/${itemId}/download`);
    return res.data.data.url;
  },
};
