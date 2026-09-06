// features/cars/schemas/create-car-schema.ts
import { z } from "zod";

/**
 * Comma-tolerant number: strips commas from strings ("2,35,000" → 235000)
 * before validating as a number. Empty string → undefined (for optional fields).
 * Runs BEFORE validation, so formatted input never produces NaN.
 */
const numberFromString = z.preprocess((val) => {
  if (typeof val === "string") {
    const cleaned = val.replace(/,/g, "").trim();
    return cleaned === "" ? undefined : Number(cleaned);
  }
  return val;
}, z.number());

/**
 * Validation for Step 1 (Vehicle & Seller).
 * Mirrors the cars table: required fields are required, enums match the DB
 * enums, optional fields are optional. The backend re-validates all of this.
 */
export const createCarSchema = z.object({
  // --- Vehicle (required) ---
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: numberFromString.pipe(
    z
      .number()
      .int()
      .min(1980, "Enter a valid year")
      .max(new Date().getFullYear() + 1, "Enter a valid year")
  ),
  reg_number: z
    .string()
    .min(1, "Registration number is required")
    .max(20)
    .transform((v) => v.toUpperCase().trim()),

  // --- Vehicle (optional) ---
  km_driven: numberFromString
    .pipe(z.number().int().min(0, "Enter a valid distance"))
    .optional(),
  fuel_type: z
    .enum(["petrol", "diesel", "electric", "hybrid", "cng"])
    .optional(),
  transmission: z.enum(["manual", "automatic"]).optional(),
  color: z.string().max(30).optional(),
  accident_history: z.string().optional(),
  specifications: z.string().optional(),

  // --- Purchase / Seller (required) ---
  purchase_amount: numberFromString.pipe(
    z.number().positive("Enter the purchase amount")
  ),
  seller_name: z
    .string()
    .min(1, "Seller name is required")
    .max(100)
    .transform((v) => v.toUpperCase().trim()),
  seller_phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

/**
 * Two types are needed because of the numberFromString fields (year,
 * km_driven, purchase_amount): their INPUT type (what react-hook-form
 * registers against — a raw string/number from the field) differs from
 * their OUTPUT type (a real number, after zodResolver parses it).
 * useForm's 3-generic signature wants both.
 */
export type CreateCarFormInput = z.input<typeof createCarSchema>;
export type CreateCarFormValues = z.output<typeof createCarSchema>;
