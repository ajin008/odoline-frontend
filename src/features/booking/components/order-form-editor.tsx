"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  orderFormSchema,
  type OrderFormValues,
} from "../schemas/booking-schemas";
import type { BookingOrder } from "../types/booking-types";
import { useSaveOrder } from "../hooks/use-booking-order";
import { X, Plus, Trash2, Loader2, Sparkles, Tag } from "lucide-react";

interface OrderFormEditorProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  existingOrder: BookingOrder | null;
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function OrderFormEditor({
  isOpen,
  onClose,
  bookingId,
  existingOrder,
}: OrderFormEditorProps) {
  const saveOrderMutation = useSaveOrder();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      remark: "",
      items: [{ name: "", amount: "0", is_free: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Reset form when modal opens or existingOrder changes
  useEffect(() => {
    if (isOpen) {
      if (existingOrder) {
        reset({
          remark: existingOrder.remark || "",
          items:
            existingOrder.items && existingOrder.items.length > 0
              ? existingOrder.items.map((i) => ({
                  name: i.name,
                  amount: i.amount,
                  is_free: i.is_free,
                }))
              : [{ name: "", amount: "0", is_free: false }],
        });
      } else {
        reset({
          remark: "",
          items: [{ name: "", amount: "0", is_free: false }],
        });
      }
    }
  }, [isOpen, existingOrder, reset]);

  // Live total computation over non-free items
  const watchedItems = useWatch({ control, name: "items" }) || [];
  const liveTotal = watchedItems.reduce((acc, item) => {
    if (!item || item.is_free) return acc;
    const num = Number(item.amount);
    return acc + (isNaN(num) || num < 0 ? 0 : num);
  }, 0);

  if (!isOpen) return null;

  const onSubmit = (values: OrderFormValues) => {
    // Process items ensuring free items have amount = "0"
    const processedItems = (values.items || []).map((item) => ({
      name: item.name.trim(),
      amount: item.is_free ? "0" : item.amount.trim() || "0",
      is_free: item.is_free,
    }));

    saveOrderMutation.mutate(
      {
        id: bookingId,
        payload: {
          remark: values.remark?.trim() || null,
          items: processedItems,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const isPending = saveOrderMutation.isPending || isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-2xl rounded-2xl border border-line bg-card shadow-2xl overflow-hidden font-sans flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-inset/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold">
              <Tag className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                {existingOrder
                  ? "Edit Order Form / Accessories"
                  : "Add Vehicle Order Form"}
              </h2>
              <p className="text-xs text-ink-subtle">
                Add extra accessories or work charges to this sale
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-card text-ink-muted hover:text-ink hover:bg-inset transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col min-h-0 flex-1"
        >
          <div className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
            {/* Lines List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Order Items / Accessories ({fields.length})
                </label>
                <span className="text-[11px] text-ink-subtle">
                  Tick Free for giveaways
                </span>
              </div>

              <div className="space-y-2.5">
                {fields.map((field, index) => {
                  const itemWatch = watchedItems
                    ? // eslint-disable-next-line security/detect-object-injection
                      watchedItems[index]
                    : undefined;
                  const isFree = itemWatch?.is_free;
                  const itemError = Array.isArray(errors.items)
                    ? // eslint-disable-next-line security/detect-object-injection
                      errors.items[index]
                    : undefined;

                  return (
                    <div
                      key={field.id}
                      className="p-3 rounded-xl border border-line/60 bg-inset/30 space-y-2 transition-all hover:border-line"
                    >
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {/* Item Name Input */}
                        <div className="flex-1 min-w-45">
                          <input
                            type="text"
                            placeholder="e.g. Ceramic coating, Floor mats"
                            {...register(`items.${index}.name`)}
                            disabled={isPending}
                            className="w-full h-9 px-3 text-xs rounded-lg border border-line bg-card text-ink placeholder:text-ink-subtle focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                          />
                          {itemError?.name && (
                            <p className="text-[10px] font-semibold text-rose-500 mt-1">
                              {itemError.name.message}
                            </p>
                          )}
                        </div>

                        {/* Free Checkbox */}
                        <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-line/60 bg-card text-xs font-semibold text-ink cursor-pointer hover:bg-inset transition-colors shrink-0 select-none">
                          <input
                            type="checkbox"
                            {...register(`items.${index}.is_free`)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setValue(`items.${index}.is_free`, checked);
                              if (checked) {
                                setValue(`items.${index}.amount`, "0");
                              }
                            }}
                            disabled={isPending}
                            className="h-3.5 w-3.5 rounded border-line text-accent focus:ring-accent accent-accent"
                          />
                          <span
                            className={
                              isFree
                                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                : ""
                            }
                          >
                            Free
                          </span>
                        </label>

                        {/* Amount Money Input (hidden when free) */}
                        {!isFree ? (
                          <div className="w-28 sm:w-32 shrink-0">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-ink-subtle">
                                ₹
                              </span>
                              <input
                                type="text"
                                placeholder="0"
                                {...register(`items.${index}.amount`)}
                                disabled={isPending}
                                className="w-full h-9 pl-6 pr-2.5 text-xs font-mono font-bold rounded-lg border border-line bg-card text-ink focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                              />
                            </div>
                            {itemError?.amount && (
                              <p className="text-[10px] font-semibold text-rose-500 mt-1">
                                {itemError.amount.message}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="w-28 sm:w-32 shrink-0 flex items-center justify-center h-9 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ₹0 (Free)
                          </div>
                        )}

                        {/* Remove Line Button */}
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          disabled={isPending}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line/60 bg-card text-ink-subtle hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-colors cursor-pointer shrink-0"
                          title="Remove Line"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Line Button */}
              <button
                type="button"
                onClick={() =>
                  append({ name: "", amount: "0", is_free: false })
                }
                disabled={isPending}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-line hover:border-accent text-xs font-bold text-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item Line</span>
              </button>
            </div>

            {/* Remark Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink uppercase tracking-wider">
                Remark / Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Customer requested ceramic coating before final delivery..."
                {...register("remark")}
                disabled={isPending}
                className="w-full p-3 text-xs rounded-xl border border-line bg-card text-ink placeholder:text-ink-subtle focus:outline-hidden focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer & Live Total Bar */}
          <div className="p-4 sm:p-5 border-t border-line bg-inset/40 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs font-semibold text-ink-subtle uppercase tracking-wider">
                Order Total:
              </span>
              <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                {formatCurrency(liveTotal)}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2.5 rounded-xl border border-line bg-card text-xs font-bold text-ink hover:bg-inset transition-colors cursor-pointer flex-1 sm:flex-none text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 flex-1 sm:flex-none shadow-xs"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Save Order Form</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
