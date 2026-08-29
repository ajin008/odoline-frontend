import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type {
  Booking,
  BookingDetail,
  BookingsPage,
  CreateBookingPayload,
  CancelBookingPayload,
} from "../types/booking-types";

export const bookingApi = {
  /** POST /api/v1/bookings — Create Prebooking (Won + Prebook atomic commit) */
  async create(payload: CreateBookingPayload): Promise<Booking> {
    const res = await apiClient.post(endpoints.bookings.create, payload);
    return res.data.data;
  },

  /** GET /api/v1/bookings — Cursor-paginated bookings list (active | closed) */
  async list(
    params: {
      status?: "active" | "closed";
      cursor?: string;
      limit?: number;
    } = {}
  ): Promise<BookingsPage> {
    const queryParams: Record<string, string | number> = {};
    if (params.status) queryParams.status = params.status;
    if (params.cursor) queryParams.cursor = params.cursor;
    if (params.limit) queryParams.limit = params.limit;

    const res = await apiClient.get(endpoints.bookings.list, {
      params: Object.keys(queryParams).length ? queryParams : undefined,
    });

    return res.data.data;
  },

  /** GET /api/v1/bookings/:id — Single booking detail */
  async getById(id: string): Promise<BookingDetail> {
    const res = await apiClient.get(endpoints.bookings.detail(id));
    return res.data.data;
  },

  /** POST /api/v1/bookings/:id/cancel — Cancel Prebooking */
  async cancel(id: string, payload: CancelBookingPayload): Promise<BookingDetail> {
    const res = await apiClient.post(endpoints.bookings.cancel(id), payload);
    return res.data.data;
  },
};

