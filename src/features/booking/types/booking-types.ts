import type { Car } from "@/src/features/cars/api/cars-api";

export type PaymentMethod =
  | "cash"
  | "bank_transfer"
  | "upi"
  | "card"
  | "cheque"
  | "loan"
  | "exchange"
  | "other";

export type PaymentType =
  | "advance"
  | "part_payment"
  | "settlement"
  | "refund"
  | "cancellation_charge";

export type BookingStatus =
  | "prebooked"
  | "offer"
  | "settlement"
  | "delivered"
  | "closed"
  | "cancelled";

export interface BookingPayment {
  id: string;
  amount: string;
  type: PaymentType;
  method: PaymentMethod;
  reference: string | null;
  paid_at: string;
  created_at: string;
}

export interface BookingCustomer {
  id: string;
  name: string;
  phone: string;
}

export interface BookingLead {
  id: string;
  stage: string;
}

export interface BookingRep {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  status: BookingStatus;
  agreed_price: string;
  balance_due_days: number | null;
  advance_receipt_no: string | null;
  advance_receipt_date: string | null;
  cancel_reason: string | null;
  booked_by: string;
  prebooked_at: string;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  rep?: BookingRep | null;
  car: Car | null;
  customer: BookingCustomer | null;
  lead: BookingLead | null;
  payments: BookingPayment[];
}

export interface CreateBookingPayload {
  lead_id: string;
  won_car_id: string;
  won_price: string;
  closing_notes?: string;
  advance_amount: string;
  advance_method: PaymentMethod;
  advance_reference?: string;
  advance_receipt_date?: string;
  balance_due_days?: number;
}

export interface BookingListItem {
  id: string;
  booking_number: string;
  status: BookingStatus;
  agreed_price: string;
  amount_paid: string;
  balance_due: string | null;
  prebooked_at: string;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  advance_total?: string | null;
  refunded_total?: string | null;
  amount_retained?: string | null;
  created_at: string;
  updated_at: string;
  rep?: BookingRep | null;
  car: Car | null;
  customer: BookingCustomer | null;
  lead: BookingLead | null;
}

export interface BookingsPagination {
  next_cursor: string | null;
  has_more: boolean;
}

export interface BookingsPage {
  items: BookingListItem[];
  pagination: BookingsPagination;
}

export type CancelReasonCode =
  | "buyer_backed_out"
  | "loan_rejected"
  | "found_another_car"
  | "price_issue"
  | "other";

export interface CancelBookingPayload {
  cancel_reason_code: CancelReasonCode;
  cancel_reason_note?: string;
  refund_amount?: string;
  refund_method?: PaymentMethod;
}

export interface BookingDetailSeller {
  name: string;
  address: string;
  phone: string;
}

export interface BookingDetail {
  id: string;
  booking_number: string;
  status: BookingStatus;
  agreed_price: string;
  balance_due_days: number | null;
  advance_receipt_no: string | null;
  advance_receipt_date: string | null;
  prebooked_at: string;
  cancelled_at: string | null;
  cancel_reason: string | null;
  created_at: string;
  updated_at: string;
  amount_paid: string;
  balance_due: string;
  amount_retained?: string | null;
  rep?: BookingRep | null;
  car: Car | null;
  customer: BookingCustomer | null;
  lead: { id: string } | null;
  payments: BookingPayment[];
  seller: BookingDetailSeller;
}

export interface OrderItem {
  id: string;
  name: string;
  amount: string;
  is_free: boolean;
  sort_order: number;
}

export interface BookingOrder {
  id: string;
  remark: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  total: string;
}

export interface SaveOrderItemPayload {
  name: string;
  amount: string;
  is_free: boolean;
}

export interface SaveOrderPayload {
  remark?: string | null;
  items: SaveOrderItemPayload[];
}



