/* eslint-disable security/detect-object-injection */
/* eslint-disable react-hooks/incompatible-library */
// features/cars/components/vehicle-seller-form.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Car,
  User,
  ArrowRight,
  Loader2,
  Check,
  Fuel,
  Sliders,
  Flame,
  Zap,
  Leaf,
  Cog,
  Cpu,
} from "lucide-react";

import { FormInput } from "@/src/components/ui/form-input";
import { FormTextarea } from "@/src/components/ui/form-textarea";
import { getLakhsCroresText } from "@/src/lib/formatters";
import {
  CustomSelect,
  type CustomSelectOption,
} from "@/src/components/ui/custom-select";
import {
  createCarSchema,
  type CreateCarFormInput,
  type CreateCarFormValues,
} from "../schemas/create-car-schema";
import { useCreateCar } from "../hooks/use-create-car";
import { useUpdateCar } from "../hooks/use-update-car";
import type { Car as CarType } from "../api/cars-api";

import { INDIAN_CAR_BRANDS } from "../type/info";

const fuelOptions: CustomSelectOption<string>[] = [
  { value: "petrol", label: "Petrol", icon: <Fuel className="h-3.5 w-3.5" /> },
  {
    value: "diesel",
    label: "Diesel",
    icon: <Fuel className="h-3.5 w-3.5 text-amber-500" />,
  },
  {
    value: "cng",
    label: "CNG",
    icon: <Flame className="h-3.5 w-3.5 text-emerald-500" />,
  },
  {
    value: "electric",
    label: "Electric (EV)",
    icon: <Zap className="h-3.5 w-3.5 text-purple-500" />,
  },
  {
    value: "hybrid",
    label: "Petrol Hybrid",
    icon: <Leaf className="h-3.5 w-3.5 text-teal-500" />,
  },
];

const transmissionOptions: CustomSelectOption<string>[] = [
  {
    value: "manual",
    label: "Manual (M/T)",
    icon: <Cog className="h-3.5 w-3.5 text-accent" />,
  },
  {
    value: "automatic",
    label: "Automatic (A/T)",
    icon: <Cpu className="h-3.5 w-3.5 text-accent" />,
  },
];

// Groups digits Indian-style (last 3, then pairs): "1234567" -> "12,34,567".
function groupIndianDigits(digits: string): string {
  if (digits.length <= 3) return digits;
  const groups: string[] = [digits.slice(-3)];
  let rest = digits.slice(0, -3);
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) groups.unshift(rest);
  return groups.join(",");
}

const formatIndianNumber = (value: string | number): string => {
  if (!value && value !== 0) return "";
  const cleanNumber = String(value).replace(/,/g, "");
  if (isNaN(Number(cleanNumber))) return "";

  const parts = cleanNumber.split(".");
  const formattedInt = groupIndianDigits(parts[0]);
  return parts.length > 1 ? formattedInt + "." + parts[1] : formattedInt;
};

const parseFormattedNumber = (value: string): number => {
  return Number(value.replace(/,/g, "")) || 0;
};

const formatVehicleRegistration = (val: string): string => {
  return val.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
};

interface VehicleSellerFormProps {
  car?: CarType;
}

export function VehicleSellerForm({ car }: VehicleSellerFormProps) {
  const isEdit = !!car;

  const createCar = useCreateCar();
  const updateCar = useUpdateCar(car?.id ?? "");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateCarFormInput, unknown, CreateCarFormValues>({
    resolver: zodResolver(createCarSchema),
    mode: "onSubmit",
    defaultValues: car
      ? {
          make: car.make,
          model: car.model,
          year: car.year,
          reg_number: car.reg_number,
          km_driven: car.km_driven
            ? (formatIndianNumber(car.km_driven) as unknown as undefined)
            : undefined,
          fuel_type:
            (car.fuel_type as CreateCarFormValues["fuel_type"]) ?? undefined,
          transmission:
            (car.transmission as CreateCarFormValues["transmission"]) ??
            undefined,
          color: car.color ?? undefined,
          accident_history: car.accident_history ?? undefined,
          specifications: car.specifications ?? undefined,
          purchase_amount: car.purchase_amount
            ? (formatIndianNumber(
                Number(car.purchase_amount)
              ) as unknown as undefined)
            : undefined,
          seller_name: car.seller_name ?? undefined,
          seller_phone: car.seller_phone ?? undefined,
        }
      : undefined,
  });

  const selectedMake = watch("make");

  const BRAND_MODELS: Record<string, string[]> = {
    "Maruti Suzuki": [
      "Swift",
      "Baleno",
      "Brezza",
      "Dzire",
      "Ertiga",
      "WagonR",
      "Alto",
      "Fronx",
      "Grand Vitara",
      "Jimny",
      "Ciaz",
      "XL6",
      "Ignis",
      "S-Presso",
    ],
    Hyundai: [
      "Creta",
      "Venue",
      "i20",
      "Verna",
      "Exter",
      "Aura",
      "Grand i10 Nios",
      "Alcazar",
      "Tucson",
      "Ioniq 5",
    ],
    "Tata Motors": [
      "Nexon",
      "Punch",
      "Harrier",
      "Safari",
      "Altroz",
      "Tiago",
      "Tigor",
      "Curvv",
    ],
    Mahindra: [
      "Thar",
      "XUV700",
      "Scorpio-N",
      "Scorpio Classic",
      "XUV300",
      "XUV400",
      "Bolero",
      "Bolero Neo",
    ],
    Kia: ["Seltos", "Sonet", "Carens", "EV6"],
    Toyota: [
      "Fortuner",
      "Innova Crysta",
      "Innova Hycross",
      "Glanza",
      "Urban Cruiser Taisor",
      "Hilux",
      "Camry",
    ],
    Honda: ["City", "Elevate", "Amaze"],
    Volkswagen: ["Virtus", "Taigun", "Tiguan"],
    Skoda: ["Slavia", "Kushaq", "Kodiaq"],
    "MG Motor": ["Hector", "Astor", "ZSEV", "Comet EV", "Gloster"],
    Renault: ["Kiger", "Triber", "Kwid"],
    Nissan: ["Magnite"],
    Citroën: ["C3", "C3 Aircross", "eC3", "C5 Aircross"],
    Jeep: ["Compass", "Meridian", "Wrangler"],
    BMW: ["3 Series", "5 Series", "X1", "X3", "X5", "7 Series", "M3", "M5"],
    "Mercedes-Benz": [
      "C-Class",
      "E-Class",
      "S-Class",
      "GLA",
      "GLC",
      "GLE",
      "GLS",
    ],
    Audi: ["A4", "A6", "Q3", "Q5", "Q7", "e-tron"],
  };

  const modelSuggestions =
    selectedMake && typeof selectedMake === "string"
      ? BRAND_MODELS[selectedMake]
      : undefined;

  const onSubmit = handleSubmit((values) => {
    const refinedValues = {
      ...values,
      km_driven: parseFormattedNumber(String(values.km_driven)),
      purchase_amount: parseFormattedNumber(String(values.purchase_amount)),
    };

    if (isEdit) {
      updateCar.mutate(refinedValues);
    } else {
      createCar.mutate(refinedValues);
    }
  });

  const isPending = isEdit ? updateCar.isPending : createCar.isPending;

  // Type-safe suggestion mapper without using 'any'
  // Simple, clean, and tells TypeScript exactly what it is
  const safeSuggestions: string[] = (INDIAN_CAR_BRANDS as string[]).map(String);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6 select-none">
      {/* ---------------- Vehicle Details Panel ---------------- */}
      <section className="rounded-2xl border border-line bg-card p-6 shadow-bento space-y-5">
        <div className="flex items-center gap-3 border-b border-line/50 pb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-light text-accent">
            <Car className="h-4 w-4 stroke-[2px]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink font-sans">
              Vehicle Details
            </h2>
            <p className="text-xs text-ink-subtle font-sans">
              Enter core specifications and performance histories.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <Controller
            name="make"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormInput
                label="Make"
                placeholder="Select or type manufacturer brand"
                ref={ref}
                value={typeof value === "string" ? value : ""}
                suggestions={safeSuggestions}
                error={errors.make?.message}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />

          <Controller
            name="model"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormInput
                label="Model"
                placeholder="Select or type model (e.g. Swift)"
                ref={ref}
                value={typeof value === "string" ? value : ""}
                suggestions={modelSuggestions}
                error={errors.model?.message}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          />

          <Controller
            name="reg_number"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormInput
                label="Registration Number"
                placeholder="e.g. KL01AB1234"
                ref={ref}
                value={typeof value === "string" ? value : ""}
                error={errors.reg_number?.message}
                onChange={(e) => {
                  const processed = formatVehicleRegistration(e.target.value);
                  onChange(processed);
                }}
              />
            )}
          />

          <FormInput
            label="Year of Manufacture"
            type="number"
            inputMode="numeric"
            placeholder="2023"
            error={errors.year?.message}
            {...register("year")}
          />

          <Controller
            name="km_driven"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormInput
                label="Distance Driven (KM)"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 45,000"
                ref={ref}
                value={formatIndianNumber(String(value ?? ""))}
                error={errors.km_driven?.message}
                onChange={(e) => {
                  const rawDigits = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(rawDigits)) {
                    onChange(rawDigits);
                  }
                }}
              />
            )}
          />

          <FormInput
            label="Color"
            placeholder="e.g. White"
            error={errors.color?.message}
            {...register("color")}
          />

          <Controller
            name="fuel_type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="space-y-1.5 font-sans">
                <label className="block text-xs font-semibold text-ink-muted">
                  Fuel Type
                </label>
                <CustomSelect
                  options={fuelOptions}
                  value={value ?? ""}
                  onChange={onChange}
                  placeholder="Select fuel setup"
                  icon={<Fuel className="h-4 w-4 text-accent" />}
                  className="w-full"
                  buttonClassName={[
                    "w-full h-10 px-3.5 py-2.5 rounded-lg border bg-inset text-xs transition-all duration-200 cursor-pointer font-bold",
                    errors.fuel_type?.message
                      ? "border-rose-500 text-rose-600"
                      : "border-line hover:border-line hover:bg-card",
                  ].join(" ")}
                />
                {errors.fuel_type?.message && (
                  <p className="text-[11px] font-semibold text-rose-500 animate-in fade-in duration-200">
                    {errors.fuel_type?.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="transmission"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="space-y-1.5 font-sans">
                <label className="block text-xs font-semibold text-ink-muted">
                  Transmission
                </label>
                <CustomSelect
                  options={transmissionOptions}
                  value={value ?? ""}
                  onChange={onChange}
                  placeholder="Select gear mechanism"
                  icon={<Sliders className="h-4 w-4 text-accent" />}
                  className="w-full"
                  buttonClassName={[
                    "w-full h-10 px-3.5 py-2.5 rounded-lg border bg-inset text-xs transition-all duration-200 cursor-pointer font-bold",
                    errors.transmission?.message
                      ? "border-rose-500 text-rose-600"
                      : "border-line hover:border-line hover:bg-card",
                  ].join(" ")}
                />
                {errors.transmission?.message && (
                  <p className="text-[11px] font-semibold text-rose-500 animate-in fade-in duration-200">
                    {errors.transmission?.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <FormTextarea
          label="Accident / Replacement History"
          placeholder="Detail major records, replacements, structural fixes or leave blank..."
          helperText="Paste WhatsApp messages or history records directly — input auto-expands to display all lines."
          error={errors.accident_history?.message}
          {...register("accident_history")}
        />

        <FormTextarea
          label="Specifications & Key Features"
          placeholder="Free text — engine capacity, variant, key features, selling points..."
          helperText="Paste feature lists or specs from WhatsApp/social media."
          error={errors.specifications?.message}
          {...register("specifications")}
        />

        <div className="max-w-md">
          <Controller
            name="purchase_amount"
            control={control}
            render={({ field: { onChange, value, ref } }) => {
              const lakhsBadge = getLakhsCroresText(
                value as string | number | null | undefined
              );
              return (
                <FormInput
                  label="Purchase Amount"
                  type="text"
                  inputMode="numeric"
                  prefix="₹"
                  placeholder="4,50,000"
                  ref={ref}
                  value={formatIndianNumber(String(value ?? ""))}
                  error={errors.purchase_amount?.message}
                  helperText={lakhsBadge ? `${lakhsBadge}` : undefined}
                  onChange={(e) => {
                    const rawDigits = e.target.value.replace(/,/g, "");
                    if (/^\d*$/.test(rawDigits)) {
                      onChange(rawDigits);
                    }
                  }}
                />
              );
            }}
          />
        </div>
      </section>

      {/* ---------------- Seller Information Panel ---------------- */}
      <section className="rounded-2xl border border-line bg-card p-6 shadow-bento space-y-5">
        <div className="flex items-center gap-3 border-b border-line/50 pb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-light text-accent">
            <User className="h-4 w-4 stroke-[2px]" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-ink font-sans">
              Seller Information
            </h2>
            <p className="text-xs text-ink-subtle font-sans tracking-tight">
              Legal ownership identity details as verified per registration
              logs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          <Controller
            name="seller_name"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormInput
                label="Seller Name"
                placeholder="Full name as written on RC"
                ref={ref}
                value={typeof value === "string" ? value : ""}
                error={errors.seller_name?.message}
                onChange={(e) => {
                  onChange(e.target.value.toUpperCase());
                }}
                className="uppercase"
              />
            )}
          />
          <FormInput
            label="Seller Contact Number"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            prefix="+91"
            placeholder="Mobile number"
            error={errors.seller_phone?.message}
            {...register("seller_phone")}
          />
        </div>
      </section>

      {/* ---------------- Primary Action Button ---------------- */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className={[
            "w-full sm:w-auto min-w-45 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-bold text-inverse shadow-sm transition-all duration-200 select-none",
            "hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          ].join(" ")}
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin stroke-[2.5px]" />
              {isEdit ? "Saving..." : "Processing..."}
            </>
          ) : isEdit ? (
            <>
              <Check className="h-4 w-4 stroke-[2.5px]" />
              Save changes
            </>
          ) : (
            <>
              Next: Documents
              <ArrowRight className="h-4 w-4 stroke-[2.5px]" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
