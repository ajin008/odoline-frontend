import { z } from "zod";

export const LEAD_PRIORITY_OPTIONS = [
  { value: "very_hot", label: "Very Hot" },
  { value: "hot", label: "Hot" },
  { value: "warm", label: "Warm" },
  { value: "cold", label: "Cold" },
] as const;

export const LEAD_SOURCE_OPTIONS = [
  { value: "walk_in", label: "Walk In" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone Call" },
  { value: "referral", label: "Referral" },
  { value: "instagram", label: "Instagram" },
  { value: "olx", label: "OLX" },
  { value: "other", label: "Other" },
] as const;

export const createLeadFormSchema = z
  .object({
    name: z.string().trim().min(1, "Customer name is required").max(100),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    priority: z.enum(["very_hot", "hot", "warm", "cold"]),
    source: z.enum([
      "walk_in",
      "whatsapp",
      "phone",
      "referral",
      "instagram",
      "olx",
      "other",
    ]),
    source_note: z.string().trim().max(100).optional().nullable(),
    budget_min: z
      .string()
      .trim()
      .refine(
        (val) => !val || !isNaN(Number(val)),
        "Budget min must be a valid number"
      )
      .optional()
      .nullable(),
    budget_max: z
      .string()
      .trim()
      .refine(
        (val) => !val || !isNaN(Number(val)),
        "Budget max must be a valid number"
      )
      .optional()
      .nullable(),
    remark: z.string().trim().optional().nullable(),
    first_follow_up_at: z.string().optional().nullable(),
    assigned_to: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.source === "other" &&
      (!data.source_note || data.source_note.trim().length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify source details when source is 'Other'",
        path: ["source_note"],
      });
    }
  });

export type CreateLeadFormData = z.infer<typeof createLeadFormSchema>;
