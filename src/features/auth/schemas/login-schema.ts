import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  pin: z
    .string()
    .min(1, "PIN is required")
    .min(4, "PIN must be at least 4 digits")
    .regex(/^\d+$/, "PIN must be numbers only"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
