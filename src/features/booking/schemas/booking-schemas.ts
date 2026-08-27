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
