"use client";

import Image from "next/image";
import type { BookingDetail, BookingOrder } from "../types/booking-types";
import { numberToWordsRupees } from "../utils/number-to-words";

interface OrderFormPrintProps {
  booking: BookingDetail;
  order: BookingOrder;
}

function formatCurrency(amountStr: string | number | null | undefined): string {
  if (!amountStr) return "₹0";
  const num = Number(amountStr);
  if (isNaN(num)) return String(amountStr);
  return `₹${num.toLocaleString("en-IN")}`;
}

function formatDateTimeIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const dateFormatted = d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const timeFormatted = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  return `${dateFormatted}, ${timeFormatted} IST`;
}

function formatWords(words: string): string {
  if (!words) return "";
  const trimmed = words.trim();
  if (trimmed.endsWith("Only")) return trimmed;
  return `${trimmed} Only`;
}

export function OrderFormPrint({ booking, order }: OrderFormPrintProps) {
  const totalInWords = formatWords(
    numberToWordsRupees(order.total) || "Zero Rupees Only"
  );

  const customerName = booking.customer?.name || "Customer";
  const customerPhone = booking.customer?.phone || "N/A";

  const carYearMakeModel = booking.car
    ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
    : "Vehicle";
  const carReg = booking.car?.reg_number || "Unregistered";

  const sellerName = booking.seller?.name || "CARS 4 PRE OWNED CARS";
  const sellerAddress =
    booking.seller?.address || "NH Bypass, Edappally, Kochi, Kerala";
  const sellerPhone = booking.seller?.phone || "";
  const repName = booking.rep?.name || "Sales Executive";

  return (
    <div
      id="order-form-print"
      className="hidden print:block text-slate-950 bg-white p-6 max-w-[210mm] mx-auto text-[10pt] leading-normal font-sans select-text border-slate-900 keep-ink"
      style={{ color: "#000000", backgroundColor: "#ffffff" }}
    >
      {/* 1. Header Band */}
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-3">
        <div className="flex items-center gap-4">
          <Image
            src="/icons/icon-512.png"
            alt="Cars4 Logo"
            width={60}
            height={60}
            className="w-[60px] h-[60px] object-contain shrink-0 no-strip keep-ink"
            priority
          />
          <div className="space-y-0.5">
            <h1 className="text-2xl font-serif font-bold uppercase tracking-tight text-slate-950">
              {sellerName}
            </h1>
            {sellerAddress && (
              <p className="text-[9.5pt] text-slate-700 leading-tight">
                {sellerAddress}
              </p>
            )}
            {sellerPhone && (
              <p className="text-[9pt] font-medium text-slate-800">
                Phone: {sellerPhone}
              </p>
            )}
          </div>
        </div>

        <div className="text-right border border-slate-900 rounded p-2 bg-slate-50 min-w-[170px] keep-ink">
          <div className="text-[8.5pt] font-semibold text-slate-600 uppercase tracking-wider">
            Booking Reference
          </div>
          <div className="text-base font-bold font-mono text-slate-950">
            No. {booking.booking_number}
          </div>
          <div className="text-[8.5pt] text-slate-700 border-t border-slate-300 mt-1 pt-0.5">
            Date: {formatDateTimeIST(order.created_at)}
          </div>
        </div>
      </div>

      {/* 2. Document Title */}
      <div className="text-center my-3">
        <h2 className="text-lg font-serif font-bold uppercase tracking-widest text-slate-950">
          VEHICLE OFFER / ACCESSORY ORDER FORM
        </h2>
        <p className="text-[8.5pt] font-medium text-slate-500 tracking-wide uppercase mt-0.5">
          Form No. 1719 — Customer Accessories &amp; Work Order Form
        </p>
      </div>

      {/* 3. Top Particulars Box (Matching paper layout) */}
      <div className="my-3 border border-slate-900 rounded overflow-hidden keep-ink">
        <table className="w-full text-left text-[9.5pt] border-collapse">
          <tbody className="divide-y divide-slate-900">
            <tr>
              <td className="w-1/4 bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Regn. No.
              </td>
              <td className="w-1/4 px-3 py-1.5 font-mono font-bold uppercase text-slate-950 border-r border-slate-900">
                {carReg}
              </td>
              <td className="w-1/4 bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Vehicle Model
              </td>
              <td className="w-1/4 px-3 py-1.5 font-bold uppercase text-slate-950">
                {carYearMakeModel}
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Customer Name
              </td>
              <td className="px-3 py-1.5 font-bold uppercase text-slate-950 border-r border-slate-900">
                {customerName}
              </td>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Telephone
              </td>
              <td className="px-3 py-1.5 font-mono text-slate-950">
                {customerPhone}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Stripped Items Table (Paper-matched: Sl. No. | Item / Offer | Customer Pay | Free) */}
      <div className="my-3 border border-slate-900 rounded overflow-hidden keep-ink">
        <table className="w-full text-left text-[9.5pt] border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-900 text-[8.5pt] font-serif font-bold text-slate-900 uppercase tracking-wider">
              <th className="py-2 px-3 w-12 text-center border-r border-slate-900">
                Sl. No.
              </th>
              <th className="py-2 px-3 border-r border-slate-900">
                Item / Offer
              </th>
              <th className="py-2 px-3 w-32 text-right border-r border-slate-900">
                Customer Pay
              </th>
              <th className="py-2 px-3 w-24 text-center">
                Free
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="py-2 px-3 text-center font-mono text-slate-700 border-r border-slate-900 text-[9pt]">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-950 border-r border-slate-900">
                    {item.name}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-950 border-r border-slate-900">
                    {item.is_free ? "—" : formatCurrency(item.amount)}
                  </td>
                  <td className="py-2 px-3 text-center font-bold text-[8.5pt]">
                    {item.is_free ? (
                      <span className="text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                        ✓ (Free)
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 px-3 text-center italic text-slate-600">
                  No specific item lines recorded.
                </td>
              </tr>
            )}
          </tbody>
          {/* Total Footer Row */}
          <tfoot>
            <tr className="border-t-2 border-slate-900 bg-slate-100/90">
              <td colSpan={2} className="py-2.5 px-3 font-serif font-bold text-right text-slate-950 uppercase tracking-wider border-r border-slate-900">
                TOTAL:
              </td>
              <td className="py-2.5 px-3 font-mono font-extrabold text-right text-slate-950 text-[11pt] border-r border-slate-900">
                {formatCurrency(order.total)}
              </td>
              <td className="py-2.5 px-3 bg-slate-100/90" />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Emphasized Total Amount in Words */}
      <div className="my-2.5 p-2 border border-slate-900 rounded bg-slate-50 text-center keep-ink">
        <div className="text-[8pt] uppercase font-semibold text-slate-600 tracking-wider">
          Total Amount in Words
        </div>
        <div className="text-[10pt] font-serif font-bold text-slate-950 mt-0.5">
          {totalInWords}
        </div>
      </div>

      {/* 5. Remarks Line (If present) */}
      {order.remark && (
        <div className="my-3 p-2.5 border border-slate-900 rounded bg-slate-50/80 text-[9pt] leading-relaxed space-y-0.5 keep-ink">
          <div className="font-serif font-bold uppercase text-slate-950 text-[8.5pt]">
            Remarks:
          </div>
          <p className="text-slate-900 font-medium">{order.remark}</p>
        </div>
      )}

      {/* 6. Ruled Signature Grid (Offered by / Approved by / Customer signature) */}
      <div className="mt-6 pt-2">
        <div className="grid grid-cols-3 gap-6 text-center text-[9pt]">
          {/* Offered By Signature */}
          <div className="flex flex-col justify-end space-y-2">
            <div className="h-12 border-b border-slate-900 flex items-end justify-center pb-0.5">
              <span className="text-[8pt] text-slate-400 italic">
                (Sign Above)
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-bold uppercase text-slate-950">
                Offered By
              </div>
              <div className="text-slate-800 text-[8.5pt]">
                Name: <span className="font-bold">{repName}</span>
              </div>
            </div>
          </div>

          {/* Approved By Signature */}
          <div className="flex flex-col justify-end space-y-2">
            <div className="h-12 border-b border-slate-900 flex items-end justify-center pb-0.5">
              <span className="text-[8pt] text-slate-400 italic">
                (Authorized Stamp &amp; Sign)
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-bold uppercase text-slate-950">
                Approved By
              </div>
              <div className="text-slate-800 text-[8.5pt]">
                For <span className="font-bold">{sellerName}</span>
              </div>
            </div>
          </div>

          {/* Customer Signature */}
          <div className="flex flex-col justify-end space-y-2">
            <div className="h-12 border-b border-slate-900 flex items-end justify-center pb-0.5">
              <span className="text-[8pt] text-slate-400 italic">
                (Sign Above)
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-bold uppercase text-slate-950">
                Customer Signature
              </div>
              <div className="text-slate-800 text-[8.5pt]">
                Name: <span className="font-bold">{customerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
