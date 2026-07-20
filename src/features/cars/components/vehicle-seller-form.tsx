// features/cars/components/vehicle-seller-form.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, User, ArrowRight, Loader2, Check } from "lucide-react";

import { FormInput } from "@/src/components/ui/form-input";
import { FormSelect } from "@/src/components/ui/form-select";
import { FormTextarea } from "@/src/components/ui/form-textarea";
import {
  createCarSchema,
  type CreateCarFormInput,
  type CreateCarFormValues,
} from "../schemas/create-car-schema";
import { useCreateCar } from "../hooks/use-create-car";
import { useUpdateCar } from "../hooks/use-update-car";
import type { Car as CarType } from "../api/cars-api";

import {
  INDIAN_CAR_BRANDS,
  TRANSMISSION_OPTIONS,
  FUEL_TYPE_OPTIONS,
} from "../type/info";

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
            <h2 className="text-sm font-bold tracking-tight text-ink font-sans">
              Vehicle Details
            </h2>
            <p className="text-xs text-ink-subtle font-sans tracking-tight">
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

          <FormInput
            label="Model"
            placeholder="e.g. Swift"
            error={errors.model?.message}
            {...register("model")}
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

          <FormSelect
            label="Fuel Type"
            placeholder="Select fuel setup"
            options={FUEL_TYPE_OPTIONS}
            error={errors.fuel_type?.message}
            defaultValue=""
            {...register("fuel_type")}
          />

          <FormSelect
            label="Transmission"
            placeholder="Select gear mechanism"
            options={TRANSMISSION_OPTIONS}
            error={errors.transmission?.message}
            defaultValue=""
            {...register("transmission")}
          />
        </div>

        <FormTextarea
          label="Accident / Replacement History"
          placeholder="Detail major records, replacements, structural fixes or leave blank..."
          error={errors.accident_history?.message}
          {...register("accident_history")}
        />

        <div className="max-w-md">
          <Controller
            name="purchase_amount"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormInput
                label="Purchase Amount"
                type="text"
                inputMode="numeric"
                prefix="₹"
                placeholder="4,50,000"
                ref={ref}
                value={formatIndianNumber(String(value ?? ""))}
                error={errors.purchase_amount?.message}
                onChange={(e) => {
                  const rawDigits = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(rawDigits)) {
                    onChange(rawDigits);
                  }
                }}
              />
            )}
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
          <FormInput
            label="Seller Name"
            placeholder="Full name as written on RC"
            error={errors.seller_name?.message}
            {...register("seller_name")}
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
