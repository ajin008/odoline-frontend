// features/cars/api/cars-api.ts
import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type { CreateCarFormValues } from "../schemas/create-car-schema";

/** A car as returned by the backend (partial — enough for the intake flow). */
export interface Car {
  id: string;

  // Vehicle
  make: string;
  model: string;
  year: number;
  reg_number: string;
  km_driven: number | null;
  fuel_type: string | null;
  transmission: string | null; // ← was missing
  color: string | null; // ← was missing
  accident_history: string | null; // ← was missing

  // Purchase / seller (owner-only)
  purchase_amount?: string;
  seller_name?: string | null; // ← was missing
  seller_phone?: string | null; // ← was missing

  // Pricing (owner-only, server-computed)
  refurb_total?: string;
  margin?: string | null;
  landing_price?: string | null;
  selling_price?: string | null;

  // Status & meta
  status: string;
  created_at: string;
  updated_at?: string;
}

export const carsApi = {
  /** POST /cars — create a car (Step 1). Returns the created car (with its id). */
  async create(data: CreateCarFormValues): Promise<Car> {
    const res = await apiClient.post(endpoints.cars.create, data);
    return res.data.data; // unwrap the { data } envelope
  },

  async getList(statuses?: string[]): Promise<Car[]> {
    const res = await apiClient.get(endpoints.cars.list, {
      params: statuses?.length ? { status: statuses.join(",") } : undefined,
    });
    return res.data.data;
  },

  async getById(id: string): Promise<Car> {
    const res = await apiClient.get(endpoints.cars.detail(id));

    return res.data.data;
  },

  async update(id: string, data: Partial<CreateCarFormValues>): Promise<Car> {
    const res = await apiClient.patch(endpoints.cars.update(id), data);
    return res.data.data;
  },
};
