/* eslint-disable security/detect-object-injection */
"use client";

import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  settleDeliverSchema,
  type SettleDeliverFormValues,
} from "../schemas/booking-schemas";
import { useSettleDeliver } from "../hooks/use-booking-actions";
import type { BookingDetail, PaymentMethod } from "../types/booking-types";
import {
  CustomSelect,
  type CustomSelectOption,
} from "@/src/components/ui/custom-select";
import { formatLakhsCrores, getLakhsCroresText } from "@/src/lib/formatters";
import {
  ShieldCheck,
  Truck,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  IndianRupee,
  Building,
  FileText,
  CreditCard,
  Gauge,
  UserCheck,
  MapPin,
  Car,
} from "lucide-react";

interface SettleDeliverFormProps {
  booking: BookingDetail;
}

const PAYMENT_METHOD_OPTIONS: CustomSelectOption<PaymentMethod>[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "cheque", label: "Cheque" },
  { value: "loan", label: "Loan Disbursement (DO)" },
  { value: "exchange", label: "Vehicle Exchange" },
  { value: "other", label: "Other" },
];

function formatCurrency(num: number): string {
  if (isNaN(num)) return "₹0";
  return `₹${num.toLocaleString("en-IN")}`;
}

export function SettleDeliverForm({ booking }: SettleDeliverFormProps) {
  const settleDeliverMutation = useSettleDeliver();

  const agreedNum = Number(booking.agreed_price || 0);
  const accessoriesNum = Number(booking.accessories_total || 0);
  const alreadyPaidNum = Number(booking.amount_paid || 0);
  const initialBalanceNum = Math.max(
    0,
    agreedNum + accessoriesNum - alreadyPaidNum
  );

  const SHOWROOM_ADDRESS =
    booking.seller?.address ||
    "Near Mahindra Showroom, Thirurkkad, Perinthalmanna, Malappuram Dist., Kerala";

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettleDeliverFormValues>({
    resolver: zodResolver(settleDeliverSchema),
    defaultValues: {
      rto_charges: "",
      insurance_charges: "",
      finance_company: "",
      remark: "",
      chassis_number: "",
      engine_number: "",
      km_reading: "",
      witness_name: "",
      delivery_place: "",
      payments:
        initialBalanceNum > 0
          ? [
              {
                amount: String(initialBalanceNum),
                method: "cash",
                reference: "",
              },
            ]
          : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  const watchRto = useWatch({ control, name: "rto_charges" });
  const watchInsurance = useWatch({ control, name: "insurance_charges" });
  const watchPayments = useWatch({ control, name: "payments" });

  const rtoNum = Number(watchRto || 0);
  const insuranceNum = Number(watchInsurance || 0);
  const grandTotalNum = agreedNum + accessoriesNum + rtoNum + insuranceNum;

  const collectingNowNum = (watchPayments || []).reduce((sum, p) => {
    const amt = Number(p.amount || 0);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  const totalPaidAfterNum = alreadyPaidNum + collectingNowNum;
  const shortfallNum = grandTotalNum - totalPaidAfterNum;
  const isFullyCovered = shortfallNum <= 0;

  const onSubmit = (values: SettleDeliverFormValues) => {
    const payload = {
      settlement: {
        rto_charges: values.rto_charges?.trim() || null,
        insurance_charges: values.insurance_charges?.trim() || null,
        finance_company: values.finance_company?.trim() || null,
        remark: values.remark?.trim() || null,
      },
      delivery: {
        chassis_number: values.chassis_number?.trim() || null,
        engine_number: values.engine_number?.trim() || null,
        km_reading: values.km_reading ? Number(values.km_reading) : null,
        witness_name: values.witness_name?.trim() || null,
        delivery_place: values.delivery_place?.trim() || null,
      },
      payments: values.payments.map((p) => ({
        amount: p.amount.trim(),
        method: p.method,
        reference: p.reference?.trim() || null,
      })),
    };

    settleDeliverMutation.mutate({ id: booking.id, payload });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 select-none font-sans"
    >
      {/* Banner / Title Header */}
      <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
          <span>Stage 3: Settlement &amp; Vehicle Delivery Handover</span>
        </div>
        <p className="text-xs text-ink-subtle leading-relaxed">
          One single form to finalize deal charges, collect remaining payments,
          and record vehicle handover details. Vehicle delivery is completed
          once full balance is cleared.
        </p>
      </div>

      {/* SECTION A: FINAL CHARGES */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Section A — Final Settlement Charges
            </h3>
          </div>
          <span className="text-[11px] text-ink-subtle font-medium">
            Step 1 of 3
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* RTO Charges */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-ink">
                RTO Transfer Charges (₹){" "}
                <span className="text-ink-subtle font-normal">(optional)</span>
              </label>
              {getLakhsCroresText(watchRto) && (
                <span className="text-[11px] font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                  {getLakhsCroresText(watchRto)}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. 5000"
              {...register("rto_charges")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-mono font-bold text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
            {errors.rto_charges && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.rto_charges.message}
              </p>
            )}
          </div>

          {/* Insurance Charges */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-ink">
                Insurance Charges (₹){" "}
                <span className="text-ink-subtle font-normal">(optional)</span>
              </label>
              {getLakhsCroresText(watchInsurance) && (
                <span className="text-[11px] font-mono font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                  {getLakhsCroresText(watchInsurance)}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="e.g. 12000"
              {...register("insurance_charges")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-mono font-bold text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
            {errors.insurance_charges && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.insurance_charges.message}
              </p>
            )}
          </div>

          {/* Finance Company */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-ink flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-ink-subtle" />
              <span>
                Finance Company / Bank{" "}
                <span className="text-ink-subtle font-normal">(optional)</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. HDFC Bank / Axis Bank"
              {...register("finance_company")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-medium text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
            {errors.finance_company && (
              <p className="text-[11px] font-semibold text-rose-500">
                {errors.finance_company.message}
              </p>
            )}
          </div>

          {/* Settlement Remark */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-ink flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-ink-subtle" />
              <span>
                Settlement Remarks{" "}
                <span className="text-ink-subtle font-normal">(optional)</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Hypothecation note, discounts..."
              {...register("remark")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-medium text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* SECTION B: PAYMENTS COLLECTED NOW */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-line/40 pb-3 gap-2.5">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4.5 w-4.5 text-accent shrink-0" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Section B — Payments Collected Now
            </h3>
          </div>
          <button
            type="button"
            onClick={() =>
              append({ amount: "", method: "cash", reference: "" })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer shadow-xs min-h-[44px] sm:min-h-0 shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Payment Row</span>
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-6 bg-inset/40 rounded-xl border border-line/40 space-y-2">
            <p className="text-xs text-ink-subtle">
              No new payment rows added. Add payment rows if collecting balance
              cash or loan disbursement now.
            </p>
            <button
              type="button"
              onClick={() =>
                append({
                  amount: String(Math.max(0, shortfallNum)),
                  method: "cash",
                  reference: "",
                })
              }
              className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Balance Payment Row</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => {
              const rowAmt = watchPayments?.[index]?.amount;
              const lakhsText = getLakhsCroresText(rowAmt);

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 rounded-xl bg-inset/50 border border-line/60 items-end"
                >
                  {/* Amount */}
                  <div className="sm:col-span-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-ink-subtle uppercase">
                        Amount (₹) *
                      </label>
                      {lakhsText && (
                        <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.2 rounded">
                          {lakhsText}
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. 2350000"
                      {...register(`payments.${index}.amount`)}
                      className="w-full h-8.5 rounded-xl border border-line/60 bg-card px-3 text-xs font-mono font-bold text-ink focus:border-accent focus:outline-none"
                    />
                    {Array.isArray(errors.payments) &&
                      errors.payments[index]?.amount?.message && (
                        <p className="text-[10px] font-semibold text-rose-500">
                          {errors.payments[index]?.amount?.message}
                        </p>
                      )}
                  </div>

                  {/* Method */}
                  <div className="sm:col-span-4 space-y-1">
                    <label className="block text-[10px] font-bold text-ink-subtle uppercase">
                      Payment Method *
                    </label>
                    <Controller
                      control={control}
                      name={`payments.${index}.method`}
                      render={({ field: selectField }) => (
                        <CustomSelect
                          options={PAYMENT_METHOD_OPTIONS}
                          value={selectField.value}
                          onChange={selectField.onChange}
                          className="w-full"
                        />
                      )}
                    />
                  </div>

                  {/* Reference */}
                  <div className="sm:col-span-3 space-y-1">
                    <label className="block text-[10px] font-bold text-ink-subtle uppercase">
                      Reference / UTR / DO
                    </label>
                    <input
                      type="text"
                      placeholder="Ref # / DO-123 (optional)"
                      {...register(`payments.${index}.reference`)}
                      className="w-full h-8.5 rounded-xl border border-line/60 bg-card px-3 text-xs font-medium text-ink focus:border-accent focus:outline-none"
                    />
                  </div>

                  {/* Delete */}
                  <div className="sm:col-span-1 flex justify-end pb-0.5">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 rounded-lg text-ink-subtle hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove Payment Row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION C: VEHICLE HANDOVER (LAST - GATED BY PAYMENT) */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Section C — Vehicle Handover Details
            </h3>
          </div>
          <span className="text-[11px] text-ink-subtle font-medium">
            Final Act
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Chassis Number */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-ink flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5 text-ink-subtle" />
              <span>
                Chassis Number (VIN){" "}
                <span className="text-ink-subtle font-normal">(optional)</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. MA1TB2..."
              {...register("chassis_number")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-mono uppercase font-bold text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
          </div>

          {/* Engine Number */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-ink">
              Engine Number{" "}
              <span className="text-ink-subtle font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. K12M..."
              {...register("engine_number")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-mono uppercase font-bold text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
          </div>

          {/* KM Reading */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-ink flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-ink-subtle" />
              <span>
                Odometer Reading (KM){" "}
                <span className="text-ink-subtle font-normal">(optional)</span>
              </span>
            </label>
            <input
              type="number"
              placeholder="e.g. 42000"
              {...register("km_reading")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-mono font-bold text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
          </div>

          {/* Witness Name */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-ink flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5 text-ink-subtle" />
              <span>
                Witness Contact{" "}
                <span className="text-ink-subtle font-normal">(optional)</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Relative or staff witness name"
              {...register("witness_name")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-medium text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
          </div>

          {/* Delivery Place */}
          <div className="sm:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <label className="block font-semibold text-ink flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-ink-subtle" />
                <span>
                  Delivery Handover Location{" "}
                  <span className="text-ink-subtle font-normal">
                    (optional)
                  </span>
                </span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-ink-subtle hidden sm:inline">
                  Quick Fill:
                </span>
                <button
                  type="button"
                  onClick={() => setValue("delivery_place", SHOWROOM_ADDRESS)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-accent/10 border border-accent/20 text-accent font-semibold hover:bg-accent hover:text-inverse transition-all cursor-pointer text-[11px]"
                  title={SHOWROOM_ADDRESS}
                >
                  <Building className="h-3 w-3" />
                  <span>Cars4 Showroom (Thirurkkad)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setValue("delivery_place", "Customer Residence")
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-inset border border-line text-ink-muted font-medium hover:bg-card hover:text-ink transition-all cursor-pointer text-[11px]"
                >
                  <span>Customer Residence</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              list="delivery-location-options"
              placeholder="Cars4 Showroom — Near Mahindra Showroom, Thirurkkad, Perinthalmanna, Malappuram Dist., Kerala"
              {...register("delivery_place")}
              className="w-full h-9 rounded-xl border border-line/60 bg-inset px-3 text-xs font-medium text-ink focus:border-accent focus:bg-card focus:outline-none transition-all"
            />
            <datalist id="delivery-location-options">
              <option value={SHOWROOM_ADDRESS}>
                Cars4 Showroom (Near Mahindra Showroom, Thirurkkad...)
              </option>
              <option value="Customer Residence" />
            </datalist>
          </div>
        </div>
      </div>

      {/* LIVE SETTLEMENT FINANCIAL SUMMARY BLOCK (STANDARD NON-STICKY FLOW) */}
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-line/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Live Settlement Financial Summary
            </h3>
          </div>

          {/* Verdict Badge */}
          {isFullyCovered ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Fully Paid ✓</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{formatLakhsCrores(shortfallNum)} Shortfall</span>
            </span>
          )}
        </div>

        {/* E-Commerce Billing Invoice Table (Row-by-Row) */}
        <div className="rounded-xl border border-line/60 bg-inset/40 p-4 space-y-3 font-sans text-xs">
          {/* Section 1: Charges & Vehicle Price */}
          <div className="space-y-2">
            {/* Row 1: Agreed Vehicle Price */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-ink-subtle font-medium">Agreed Vehicle Price</span>
              <div className="text-right font-mono">
                <span className="font-semibold text-ink">{formatCurrency(agreedNum)}</span>
                <span className="text-[11px] text-ink-subtle ml-2">({formatLakhsCrores(agreedNum)})</span>
              </div>
            </div>

            {/* Row 2: Accessories & Add-ons */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-ink-subtle font-medium">Accessories &amp; Add-ons</span>
              <div className="text-right font-mono">
                <span className="font-semibold text-ink">+ {formatCurrency(accessoriesNum)}</span>
                <span className="text-[11px] text-ink-subtle ml-2">({formatLakhsCrores(accessoriesNum)})</span>
              </div>
            </div>

            {/* Row 3: RTO & Insurance */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-ink-subtle font-medium">RTO &amp; Insurance</span>
              <div className="text-right font-mono">
                <span className="font-semibold text-ink">+ {formatCurrency(rtoNum + insuranceNum)}</span>
                <span className="text-[11px] text-ink-subtle ml-2">({formatLakhsCrores(rtoNum + insuranceNum)})</span>
              </div>
            </div>
          </div>

          {/* Row 4: Grand Total Row */}
          <div className="border-t border-line/60 pt-2.5 flex items-center justify-between font-bold">
            <span className="text-ink uppercase tracking-wider text-xs">Grand Total Payable</span>
            <div className="text-right font-mono text-sm">
              <span className="text-ink">{formatCurrency(grandTotalNum)}</span>
              <span className="text-xs text-accent ml-2">({formatLakhsCrores(grandTotalNum)})</span>
            </div>
          </div>

          {/* Section 2: Payments & Collections */}
          <div className="border-t border-line/50 pt-2.5 space-y-2">
            {/* Row 5: Already Paid */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Already Paid (Advance)</span>
              </span>
              <div className="text-right font-mono">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">- {formatCurrency(alreadyPaidNum)}</span>
                <span className="text-[11px] text-ink-subtle ml-2">({formatLakhsCrores(alreadyPaidNum)})</span>
              </div>
            </div>

            {/* Row 6: Collecting Now */}
            <div className="flex items-center justify-between py-0.5">
              <span className="text-ink-subtle font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Collecting Now (This Settlement)</span>
              </span>
              <div className="text-right font-mono">
                <span className="font-semibold text-accent">- {formatCurrency(collectingNowNum)}</span>
                <span className="text-[11px] text-ink-subtle ml-2">({formatLakhsCrores(collectingNowNum)})</span>
              </div>
            </div>
          </div>

          {/* Row 7: Net Balance Remaining Highlighted Row */}
          <div
            className="border-0 flex items-center justify-between font-bold rounded-xl p-3 mt-1"
            style={{
              backgroundColor: isFullyCovered ? "#d8f1b7" : "#fae9cf",
            }}
          >
            <span
              className={`uppercase tracking-wider text-xs flex items-center gap-1.5 font-extrabold ${
                isFullyCovered ? "text-emerald-950" : "text-amber-950"
              }`}
            >
              {isFullyCovered ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-900 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-900 shrink-0" />
              )}
              <span>Net Balance Remaining</span>
            </span>

            <div
              className={`text-right font-mono text-sm font-extrabold ${
                isFullyCovered ? "text-emerald-950" : "text-amber-950"
              }`}
            >
              {shortfallNum > 0 ? (
                <>
                  <span>{formatCurrency(shortfallNum)}</span>
                  <span className="text-xs opacity-85 ml-2 font-bold">
                    ({formatLakhsCrores(shortfallNum)} Shortfall)
                  </span>
                </>
              ) : (
                <span>₹0 (Cleared &amp; Fully Paid)</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button & Guard Message */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-line/40">
          <div className="text-xs text-ink-subtle">
            {!isFullyCovered ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Full balance required before delivery —{" "}
                  <strong className="font-mono">
                    {formatLakhsCrores(shortfallNum)} (
                    {formatCurrency(shortfallNum)})
                  </strong>{" "}
                  remaining.
                </span>
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Full balance cleared ({formatLakhsCrores(totalPaidAfterNum)}{" "}
                  collected). Ready for vehicle handover.
                </span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFullyCovered || settleDeliverMutation.isPending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-xl bg-accent text-inverse font-bold text-xs transition-all duration-150 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer shrink-0 min-h-[44px] sm:min-h-0"
          >
            {settleDeliverMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Settlement &amp; Delivery...</span>
              </>
            ) : (
              <>
                <Truck className="h-4 w-4" />
                <span>Complete Settlement &amp; Deliver Vehicle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
