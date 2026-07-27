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

export const changePinSchema = z
  .object({
    current_pin: z.string().regex(/^\d{6}$/, "Enter your 6-digit PIN"),
    new_pin: z.string().regex(/^\d{6}$/, "New PIN must be 6 digits"),
    confirm_pin: z.string(),
  })
  .refine((d) => d.new_pin === d.confirm_pin, {
    message: "PINs don't match",
    path: ["confirm_pin"],
  })
  .refine((d) => d.current_pin !== d.new_pin, {
    message: "New PIN must be different",
    path: ["new_pin"],
  });

export type ChangePinValues = z.infer<typeof changePinSchema>;
