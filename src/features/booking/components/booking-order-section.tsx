"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useBooking } from "../hooks/use-booking";
import { useBookingOrder, useDeleteOrder } from "../hooks/use-booking-order";
import { OrderFormEditor } from "./order-form-editor";
import { OrderFormPrint } from "./order-form-print";
import type { BookingStatus } from "../types/booking-types";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
  Share2,
  Download,
} from "lucide-react";

interface BookingOrderSectionProps {
  bookingId: string;
  bookingStatus: BookingStatus;
  readOnly?: boolean;
}

function formatCurrency(amountStr: string | null | undefined): string {
  if (!amountStr) return "₹0";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return `₹${num.toLocaleString("en-IN")}`;
}

export function BookingOrderSection({
  bookingId,
  bookingStatus,
  readOnly = false,
}: BookingOrderSectionProps) {
  const { data: booking } = useBooking(bookingId);
  const { data: order, isLoading } = useBookingOrder(bookingId);
  const deleteOrderMutation = useDeleteOrder();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isTerminal = bookingStatus === "cancelled" || bookingStatus === "closed";
  const canEdit = !readOnly && !isTerminal;

  const handleDelete = () => {
    deleteOrderMutation.mutate(bookingId, {
      onSuccess: () => {
        setIsConfirmingDelete(false);
      },
    });
  };

  const handlePrintOrder = () => {
    if (!order || !booking) return;
    const originalTitle = document.title;
    const customerName = booking.customer?.name || "Customer";
    const sanitizedCustomer = customerName.replace(/[/\\?%*:|"<>]/g, "").trim();
    document.title = `Cars4 Order Form - ${sanitizedCustomer}`;
    document.body.setAttribute("data-print-document", "order");
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
      document.body.removeAttribute("data-print-document");
    }, 1000);
  };

  const handleShareOrder = async () => {
    if (!order || !booking) return;

    const carStr = booking.car
      ? `${booking.car.year} ${booking.car.make} ${booking.car.model}${
          booking.car.reg_number ? ` (${booking.car.reg_number})` : ""
        }`
      : "Vehicle";

    const shareText = `Cars4 Order — ${booking.booking_number}\nCustomer: ${
      booking.customer?.name || "Customer"
    } · ${carStr}\nAccessories total: ${formatCurrency(order.total)}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Cars4 Order — ${booking.booking_number}`,
          text: shareText,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Order summary copied to clipboard");
    } catch {
      toast.error("Failed to copy summary to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs select-none">
        <div className="h-5 w-40 animate-pulse rounded-lg bg-inset border border-line" />
        <div className="h-20 animate-pulse rounded-xl bg-inset border border-line" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-line bg-card p-5 space-y-4 shadow-xs select-none font-sans">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-line/40 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Tag className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-bold text-ink font-sans">
              Vehicle Order Form &amp; Accessories
            </h3>
            {order && (
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {formatCurrency(order.total)}
              </span>
            )}
          </div>

          {/* Header Actions when Order Exists */}
          {order && (
            <div className="flex items-center gap-2 flex-wrap">
              {/* Share, PDF Download & Print Buttons */}
              <button
                type="button"
                onClick={handleShareOrder}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
                title="Share Order Summary"
              >
                <Share2 className="h-3.5 w-3.5 text-ink-subtle" />
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={handlePrintOrder}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer"
                title="Download Order Form PDF"
              >
                <Download className="h-3.5 w-3.5 text-ink-subtle" />
                <span>PDF</span>
              </button>

              <button
                type="button"
                onClick={handlePrintOrder}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs"
                title="Print Order Form Document"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Order Form</span>
              </button>

              {/* Edit / Remove controls for non-terminal, non-readOnly staff */}
              {canEdit && (
                <>
                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-1.5 bg-rose-500/10 p-1 rounded-xl border border-rose-500/20">
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 px-2">
                        Remove form?
                      </span>
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteOrderMutation.isPending}
                        className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-1"
                      >
                        {deleteOrderMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Yes, Delete"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(false)}
                        disabled={deleteOrderMutation.isPending}
                        className="px-2 py-1 rounded-lg bg-card text-ink-subtle text-xs font-bold hover:text-ink cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line bg-card text-xs font-semibold text-ink-subtle hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-colors cursor-pointer"
                        title="Remove Order Form"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsEditorOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-inverse text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit Order</span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* State A: No Order Form Exists */}
        {!order ? (
          <div className="rounded-xl border border-dashed border-line p-6 text-center space-y-3 bg-inset/20">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <FileText className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-ink">
                No Order Form Added
              </h4>
              <p className="text-[11px] text-ink-subtle max-w-sm mx-auto">
                Accessories and work charges are optional. Create an order form if the buyer requested accessories.
              </p>
            </div>

            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditorOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add Order Form</span>
              </button>
            )}
          </div>
        ) : (
          /* State B: Order Form Exists */
          <div className="space-y-4">
            {/* Items Table / List */}
            {order.items && order.items.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-line/50">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-line/50 text-[10px] font-bold text-ink-subtle uppercase tracking-wider bg-inset">
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-3">Item / Accessory</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/40 bg-card">
                    {order.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-inset/50 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono text-ink-subtle text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-ink flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.is_free && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Free Giveaway
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-bold font-mono text-right">
                          {item.is_free ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              ₹0
                            </span>
                          ) : (
                            <span className="text-ink">
                              {formatCurrency(item.amount)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-xs text-ink-subtle italic py-3 text-center bg-inset/30 rounded-xl border border-line/40">
                Remark recorded with no specific item lines.
              </div>
            )}

            {/* Remark Box */}
            {order.remark && (
              <div className="bg-inset/40 p-3 rounded-xl border border-line/40 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                  Remark / Note
                </span>
                <p className="text-ink leading-relaxed font-medium">
                  {order.remark}
                </p>
              </div>
            )}

            {/* Total Footer Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Order Accessories Total:</span>
              </span>
              <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Order Form Editor Modal */}
      <OrderFormEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        bookingId={bookingId}
        existingOrder={order || null}
      />

      {/* Hidden Printable PDF Document */}
      {order && booking && (
        <OrderFormPrint booking={booking} order={order} />
      )}
    </>
  );
}
