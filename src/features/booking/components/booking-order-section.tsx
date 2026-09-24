"use client";

import { useState } from "react";
import { useBooking } from "../hooks/use-booking";
import { useBookingOrder, useDeleteOrder } from "../hooks/use-booking-order";
import { bookingApi } from "../api/booking-api";
import { isBookingEditable } from "../utils/booking-status-map";
import { downloadPdfDocument, sharePdfDocument, buildDocFilename } from "../utils/doc-actions";
import { DocumentPreviewModal } from "@/src/components/ui/document-preview-modal";
import { OrderFormEditor } from "./order-form-editor";
import type { BookingStatus } from "../types/booking-types";
import Link from "next/link";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
  Download,
  Share2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface BookingOrderSectionProps {
  bookingId: string;
  bookingStatus: BookingStatus;
  readOnly?: boolean;
  basePath?: string;
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
  basePath = "/staff/booking",
}: BookingOrderSectionProps) {
  const { data: booking } = useBooking(bookingId);
  const { data: order, isLoading } = useBookingOrder(bookingId);
  const deleteOrderMutation = useDeleteOrder();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const editable = isBookingEditable(bookingStatus);
  const canEdit = !readOnly && editable;

  const handleDelete = () => {
    deleteOrderMutation.mutate(bookingId, {
      onSuccess: () => {
        setIsConfirmingDelete(false);
      },
    });
  };

  const handleViewOrderPdf = () => {
    if (!order || !booking) return;
    setIsPreviewOpen(true);
  };

  const handleDownloadOrderPdf = async () => {
    if (!order || !booking) return;
    setIsDownloading(true);
    const filename = buildDocFilename(
      "Order-Form",
      booking.booking_number,
      booking.customer?.name
    );
    try {
      await downloadPdfDocument({
        fetchBlob: () => bookingApi.getOrderPdf(booking.id),
        filename,
        docTitle: "Order form PDF",
      });
    } catch {
      // handled inside helper
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareOrder = async () => {
    if (!order || !booking) return;
    const customerName = booking.customer?.name || "Customer";
    const filename = buildDocFilename(
      "Order-Form",
      booking.booking_number,
      customerName
    );
    const shareText = `Odoline Order Form — ${booking.booking_number} — ${customerName}`;

    try {
      await sharePdfDocument({
        fetchBlob: () => bookingApi.getOrderPdf(booking.id),
        filename,
        shareTitle: `Odoline Order Form ${booking.booking_number}`,
        shareText,
      });
    } catch {
      // handled inside helper
    }
  };

  if (isLoading) {
    return (
      <div className="h-32 animate-pulse rounded-2xl bg-card border border-line" />
    );
  }

  const showProceedBar = Boolean(editable && !readOnly);

  return (
    <div className="space-y-5 select-none font-sans pb-36 sm:pb-12">
      {/* Guided Next-Stage Proceed Banner */}
      {showProceedBar && (
        <div className="rounded-2xl border-none bg-[#e0f2fe] p-4 sm:p-5 space-y-4 shadow-xs font-sans">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[#0369a1] uppercase tracking-wider flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-[#0284c7] shrink-0" />
              <span>Next Guided Pipeline Step</span>
            </div>
            <div className="text-xs text-[#0c4a6e] leading-relaxed font-medium">
              Order form &amp; accessories updated. Proceed to final settlement and vehicle delivery handover.
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2.5 pt-3 border-t border-[#bae6fd]">
            <Link
              href={`${basePath}/${bookingId}/agreement`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-line text-xs font-bold text-ink hover:bg-inset transition-colors cursor-pointer shadow-xs min-h-[44px] sm:min-h-0"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-ink-subtle" />
              <span>Back to Agreement</span>
            </Link>
            <Link
              href={`${basePath}/${bookingId}/settlement`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 shadow-md cursor-pointer min-h-[44px] sm:min-h-0"
            >
              <span>Proceed to Settlement &amp; Delivery</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 space-y-4 shadow-xs">
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

          {/* Header Actions when Order Exists - Responsive flex wrap on tablet */}
          {order && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleViewOrderPdf}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-1.5 rounded-xl bg-accent text-inverse text-xs font-bold transition-opacity hover:opacity-95 cursor-pointer shadow-xs disabled:opacity-50 min-h-[44px] sm:min-h-0"
                title="View or Print Order Form PDF"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>View / Print</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadOrderPdf}
                disabled={isDownloading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer disabled:opacity-50 min-h-[44px] sm:min-h-0"
                title="Direct Download Order Form PDF"
              >
                <Download className="h-3.5 w-3.5 text-ink-subtle" />
                <span>{isDownloading ? "Downloading..." : "Download"}</span>
              </button>

              <button
                type="button"
                onClick={handleShareOrder}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-1.5 rounded-xl bg-inset border border-line text-xs font-semibold text-ink hover:bg-card transition-colors cursor-pointer min-h-[44px] sm:min-h-0"
                title="Share Order Summary"
              >
                <Share2 className="h-3.5 w-3.5 text-ink-subtle" />
                <span>Share</span>
              </button>

              {/* Edit / Remove controls for non-terminal, non-readOnly staff */}
              {canEdit && (
                <>
                  {isConfirmingDelete ? (
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-between gap-1.5 bg-rose-500/10 p-1 rounded-xl border border-rose-500/20">
                      <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 px-1 truncate">
                        Remove form?
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={deleteOrderMutation.isPending}
                          className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          {deleteOrderMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsConfirmingDelete(false)}
                          disabled={deleteOrderMutation.isPending}
                          className="px-2 py-1 rounded-lg bg-card text-ink-subtle text-xs font-bold hover:text-ink cursor-pointer shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditorOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-inverse text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Edit Order</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(true)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl border border-line bg-card text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-colors cursor-pointer col-span-2 sm:col-span-1"
                        title="Remove Order Form"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
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
                {canEdit ? "No Order Form Added" : "No Order Form Was Added"}
              </h4>
              <p className="text-[11px] text-ink-subtle max-w-sm mx-auto">
                {canEdit
                  ? "Accessories and work charges are optional. Create an order form if the buyer requested accessories."
                  : "No vehicle order form or accessories were added for this booking."}
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
                      <tr
                        key={item.id}
                        className="hover:bg-inset/50 transition-colors"
                      >
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
            <div
              className="flex items-center justify-between p-3.5 rounded-xl border-0"
              style={{ backgroundColor: "#d8f1b7" }}
            >
              <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-900 shrink-0" />
                <span>Order Accessories Total:</span>
              </span>
              <span className="text-base font-extrabold font-mono text-emerald-950">
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

      {/* Document Preview Modal (View / Print) */}
      {order && booking && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Order Form — ${booking.booking_number}`}
          fileName={buildDocFilename(
            "Order-Form",
            booking.booking_number,
            booking.customer?.name
          )}
          mimeType="application/pdf"
          fetchBlob={() => bookingApi.getOrderPdf(booking.id)}
          shareText={`Odoline Order Form — ${booking.booking_number} — ${booking.customer?.name || "Customer"}`}
        />
      )}
    </div>
  );
}
