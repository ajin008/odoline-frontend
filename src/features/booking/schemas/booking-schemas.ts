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
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Advance amount must be greater than 0",
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

