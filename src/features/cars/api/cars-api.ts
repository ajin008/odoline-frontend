// features/cars/api/cars-api.ts
import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type { CreateCarFormValues } from "../schemas/create-car-schema";

export interface ProgressSummary {
  documents?: {
    has_pending?: boolean;
    hard_docs_complete?: boolean;
    total_required?: number;
    uploaded_required?: number;
    pending_required?: number;
    is_complete?: boolean;
    uploaded_all?: number;
  };
  refurbishment?: {
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    progress_percentage: number;
    is_complete: boolean;
  };
}

/** A car as returned by the backend. */
export interface Car {
  id: string;

  // Vehicle
  make: string;
  model: string;
  year: number;
  reg_number: string;
  km_driven: number | null;
  fuel_type: string | null;
  transmission: string | null;
  color: string | null;
  accident_history: string | null;

  // Purchase / seller (owner-only)
  purchase_amount?: string;
  seller_name?: string | null;
  seller_phone?: string | null;

  // Pricing (owner-only, server-computed)
  refurb_total?: string;
  margin?: string | null;
  landing_price?: string | null;
  selling_price?: string | null;

  // Status & phase timestamps
  status: string;
  purchasing_at?: string | null;
  refurb_started_at?: string | null;
  refurb_completed_at?: string | null;
  stock_added_at?: string | null;
  booked_at?: string | null;
  delivered_at?: string | null;
  closed_at?: string | null;
  notes?: string | null;

  created_at: string;
  updated_at?: string;

  days_in_stock?: number | null;

  // Batch-generated 7-day presigned thumbnail URL
  thumbnail_url?: string | null;

  // Enriched progress summary metadata
  progress_summary?: ProgressSummary;
}

/** Pagination metadata that comes back alongside every cars list page. */
export interface CarsPagination {
  next_cursor: string | null;
  has_more: boolean;
}

export interface CarsPage {
  data: Car[];
  pagination: CarsPagination;
}

export const carsApi = {
  /** POST /cars — create a car (Step 1). Returns the created car (with its id). */
  async create(data: CreateCarFormValues): Promise<Car> {
    const res = await apiClient.post(endpoints.cars.create, data);
    return res.data.data;
  },

  /**
   * GET /cars — cursor (keyset) paginated. Omit `cursor` for the first page;
   * pass the previous page's `pagination.next_cursor` to fetch the next one.
   */
  async getList({
    statuses,
    sort,
    search,
    cursor,
    limit,
  }: {
    statuses?: string[];
    sort?: string;
    search?: string;
    cursor?: string;
    limit?: number;
  } = {}): Promise<CarsPage> {
    const params: Record<string, string | number> = {};
    if (statuses?.length) params.status = statuses.join(",");
    if (sort) params.sort = sort;
    if (search?.trim()) params.search = search.trim();
    if (cursor) params.cursor = cursor;
    if (limit) params.limit = limit;

    const res = await apiClient.get(endpoints.cars.list, {
      params: Object.keys(params).length ? params : undefined,
    });
    return { data: res.data.data, pagination: res.data.pagination };
  },

  async getById(id: string): Promise<Car> {
    const res = await apiClient.get(endpoints.cars.detail(id));

    return res.data.data;
  },

  async update(id: string, data: Partial<CreateCarFormValues>): Promise<Car> {
    const res = await apiClient.patch(endpoints.cars.update(id), data);
    return res.data.data;
  },

  async updateMargin(carId: string, margin: string) {
    const res = await apiClient.patch(endpoints.cars.margin(carId), { margin });
    return res.data.data;
  },

  async addToStock(carId: string) {
    const res = await apiClient.post(endpoints.cars.addToStock(carId));
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(endpoints.cars.detail(id));
  },
};
