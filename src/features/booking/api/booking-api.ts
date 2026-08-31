import { apiClient } from "@/src/lib/api-client";
import { endpoints } from "@/src/lib/endpoints";
import type {
  Booking,
  BookingDetail,
  BookingsPage,
  BookingTab,
  CreateBookingPayload,
  CancelBookingPayload,
  BookingOrder,
  SaveOrderPayload,
  EditAgreementPayload,
  SettleDeliverPayload,
} from "../types/booking-types";

export const bookingApi = {
  /** POST /api/v1/bookings — Create Prebooking (Won + Prebook atomic commit) */
  async create(payload: CreateBookingPayload): Promise<Booking> {
    const res = await apiClient.post(endpoints.bookings.create, payload);
    return res.data.data;
  },

  /** GET /api/v1/bookings — Cursor-paginated bookings list (tab: prebooked | delivered | completed | cancelled) */
  async list(
    params: {
      tab?: BookingTab;
      status?: "active" | "closed";
      cursor?: string;
      limit?: number;
    } = {}
  ): Promise<BookingsPage> {
    const queryParams: Record<string, string | number> = {};
    if (params.tab) queryParams.tab = params.tab;
    else if (params.status) queryParams.status = params.status;
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

  /** PATCH /api/v1/bookings/:id/agreement — Edit Agreement Metadata */
  async editAgreement(
    id: string,
    payload: EditAgreementPayload
  ): Promise<BookingDetail> {
    const res = await apiClient.patch(endpoints.bookings.editAgreement(id), payload);
    return res.data.data;
  },

  /** POST /api/v1/bookings/:id/cancel — Cancel Prebooking */
  async cancel(id: string, payload: CancelBookingPayload): Promise<BookingDetail> {
    const res = await apiClient.post(endpoints.bookings.cancel(id), payload);
    return res.data.data;
  },

  /** GET /api/v1/bookings/:id/order — Fetch Order Form */
  async getOrder(id: string): Promise<BookingOrder | null> {
    const res = await apiClient.get(endpoints.bookings.order(id));
    return res.data.data.order;
  },

  /** PUT /api/v1/bookings/:id/order — Save/Replace Order Form */
  async saveOrder(id: string, payload: SaveOrderPayload): Promise<BookingOrder> {
    const res = await apiClient.put(endpoints.bookings.order(id), payload);
    return res.data.data.order;
  },

  /** DELETE /api/v1/bookings/:id/order — Delete Order Form */
  async deleteOrder(id: string): Promise<void> {
    await apiClient.delete(endpoints.bookings.order(id));
  },

  /** GET /api/v1/bookings/:id/agreement/pdf — Fetch Agreement PDF blob */
  async getAgreementPdf(id: string): Promise<Blob> {
    const res = await apiClient.get(endpoints.bookings.agreementPdf(id), {
      responseType: "blob",
    });
    return res.data;
  },

  /** GET /api/v1/bookings/:id/order/pdf — Fetch Order Form PDF blob */
  async getOrderPdf(id: string): Promise<Blob> {
    const res = await apiClient.get(endpoints.bookings.orderPdf(id), {
      responseType: "blob",
    });
    return res.data;
  },

  /** GET /api/v1/bookings/:id/settlement/pdf — Fetch Settlement Form PDF blob */
  async getSettlementPdf(id: string): Promise<Blob> {
    const res = await apiClient.get(endpoints.bookings.settlementPdf(id), {
      responseType: "blob",
    });
    return res.data;
  },

  /** GET /api/v1/bookings/:id/delivery/pdf — Fetch Delivery Note PDF blob */
  async getDeliveryPdf(id: string): Promise<Blob> {
    const res = await apiClient.get(endpoints.bookings.deliveryPdf(id), {
      responseType: "blob",
    });
    return res.data;
  },

  /** POST /api/v1/bookings/:id/settle-deliver — Complete Settlement + Delivery */
  async settleDeliver(id: string, payload: SettleDeliverPayload): Promise<BookingDetail> {
    const res = await apiClient.post(endpoints.bookings.settleDeliver(id), payload);
    return res.data.data;
  },

  /** POST /api/v1/bookings/:id/close — Close Booking (RC transfer document upload + flip status to closed) */
  async close(id: string, formData: FormData): Promise<BookingDetail> {
    const res = await apiClient.post(endpoints.bookings.close(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};



