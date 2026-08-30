import { z } from "zod";

export const PAYMENT_METHODS = [
  "cash",
  "bank_transfer",
  "upi",
  "card",
  "cheque",
  "loan",
  "exchange",
  "other",
] as const;

export const advanceAgreementSchema = z.object({
  advance_amount: z
    .string()
    .min(1, "Advance amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 3000, {
      message: "Advance amount must be at least ₹3,000",
    }),
  advance_method: z.enum(PAYMENT_METHODS, {
    message: "Please select a payment method",
  }),
  advance_reference: z.string().optional().or(z.literal("")),
  advance_receipt_date: z.string().optional().or(z.literal("")),
  balance_due_days: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        (!isNaN(Number(val)) &&
          Number.isInteger(Number(val)) &&
          Number(val) > 0),
      { message: "Balance due days must be a positive whole number" }
    ),
});

export type AdvanceAgreementFormValues = z.infer<
  typeof advanceAgreementSchema
>;

export const CANCEL_REASON_CODES = [
  "buyer_backed_out",
  "loan_rejected",
  "found_another_car",
  "price_issue",
  "other",
] as const;

export const createCancelBookingSchema = (maxRefund: number) =>
  z
    .object({
      cancel_reason_code: z.enum(CANCEL_REASON_CODES, {
        message: "Please select a cancellation reason",
      }),
      cancel_reason_note: z.string().optional().or(z.literal("")),
      refund_amount: z
        .string()
        .min(1, "Refund amount is required")
        .refine((val) => !isNaN(Number(val)), {
          message: "Refund amount must be a valid number",
        })
        .refine((val) => Number(val) >= 0, {
          message: "Refund amount cannot be negative",
        })
        .refine((val) => Number(val) <= maxRefund, {
          message: `Refund amount cannot exceed total advance paid (₹${maxRefund.toLocaleString("en-IN")})`,
        }),
    })
    .superRefine((data, ctx) => {
      if (
        data.cancel_reason_code === "other" &&
        (!data.cancel_reason_note || data.cancel_reason_note.trim().length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Reason note is required when reason is 'Other'",
          path: ["cancel_reason_note"],
        });
      }
    });

export type CancelBookingFormValues = z.infer<
  ReturnType<typeof createCancelBookingSchema>
>;

export const orderItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Item name is required")
    .max(150, "Item name must not exceed 150 characters"),
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Amount must be a non-negative number",
    }),
  is_free: z.boolean(),
});

export const orderFormSchema = z.object({
  remark: z.string().optional().or(z.literal("")),
  items: z.array(orderItemSchema),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const editAgreementSchema = z.object({
  advance_receipt_no: z.string().trim().optional().or(z.literal("")),
  advance_receipt_date: z.string().optional().or(z.literal("")),
  balance_due_days: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        (!isNaN(Number(val)) &&
          Number.isInteger(Number(val)) &&
          Number(val) > 0),
      { message: "Balance deadline must be a positive whole number" }
    ),
});

export type EditAgreementFormValues = z.infer<typeof editAgreementSchema>;

export const settleDeliverPaymentItemSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  method: z.enum(PAYMENT_METHODS, {
    message: "Select a payment method",
  }),
  reference: z.string().trim().optional().or(z.literal("")),
});

export const settleDeliverSchema = z.object({
  rto_charges: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "RTO charges must be a non-negative number",
    }),
  insurance_charges: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "Insurance charges must be a non-negative number",
    }),
  finance_company: z
    .string()
    .trim()
    .max(150, "Finance company name must not exceed 150 characters")
    .optional()
    .or(z.literal("")),
  remark: z.string().trim().optional().or(z.literal("")),

  chassis_number: z
    .string()
    .trim()
    .max(50, "Chassis number must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  engine_number: z
    .string()
    .trim()
    .max(50, "Engine number must not exceed 50 characters")
    .optional()
    .or(z.literal("")),
  km_reading: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        (!isNaN(Number(val)) &&
          Number.isInteger(Number(val)) &&
          Number(val) >= 0),
      { message: "KM reading must be a non-negative whole number" }
    ),
  witness_name: z
    .string()
    .trim()
    .max(100, "Witness name must not exceed 100 characters")
    .optional()
    .or(z.literal("")),
  delivery_place: z
    .string()
    .trim()
    .max(150, "Delivery place must not exceed 150 characters")
    .optional()
    .or(z.literal("")),

  payments: z.array(settleDeliverPaymentItemSchema),
});

export type SettleDeliverFormValues = z.infer<typeof settleDeliverSchema>;




