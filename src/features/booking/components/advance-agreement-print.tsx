"use client";

import Image from "next/image";
import type { BookingDetail } from "../types/booking-types";
import { numberToWordsRupees } from "../utils/number-to-words";

interface AdvanceAgreementPrintProps {
  booking: BookingDetail;
}

function formatCurrency(amountStr: string | number | null | undefined): string {
  if (!amountStr) return "₹0";
  const num = Number(amountStr);
  if (isNaN(num)) return String(amountStr);
  return `₹${num.toLocaleString("en-IN")}`;
}

function formatDateIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
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

function formatDateOrdinalIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  const day = d.getDate();
  const month = d.toLocaleDateString("en-IN", {
    month: "long",
    timeZone: "Asia/Kolkata",
  });
  const year = d.getFullYear();

  const suffix = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  return `${day}${suffix(day)} ${month} ${year}`;
}

function formatWords(words: string): string {
  if (!words) return "";
  const trimmed = words.trim();
  if (trimmed.endsWith("Only")) return trimmed;
  return `${trimmed} Only`;
}

export function AdvanceAgreementPrint({ booking }: AdvanceAgreementPrintProps) {
  const advanceInWords = formatWords(
    numberToWordsRupees(booking.amount_paid) || "Zero Rupees Only"
  );
  const agreedInWords = formatWords(numberToWordsRupees(booking.agreed_price));
  const balanceInWords = formatWords(numberToWordsRupees(booking.balance_due));

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

  const hasReceiptInfo = Boolean(
    (booking.advance_receipt_no && booking.advance_receipt_no.trim().length > 0) ||
    (booking.advance_receipt_date && booking.advance_receipt_date.trim().length > 0)
  );

  const balanceDaysStr = booking.balance_due_days
    ? `${booking.balance_due_days} working days`
    : "Agreed working days";

  return (
    <div
      id="advance-agreement-print"
      className="hidden print:block text-slate-950 bg-white p-6 max-w-[210mm] mx-auto text-[10pt] leading-normal font-sans select-text border-slate-900 keep-ink"
      style={{ color: "#000000", backgroundColor: "#ffffff" }}
    >
      {/* 1. Header Band */}
      <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3 mb-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
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
            Date: {formatDateTimeIST(booking.prebooked_at)}
          </div>
        </div>
      </div>

      {/* 2. Document Title */}
      <div className="text-center my-3">
        <h2 className="text-lg font-serif font-bold uppercase tracking-widest text-slate-950">
          ADVANCE SALE AGREEMENT CUM RECEIPT
        </h2>
        <p className="text-[8.5pt] font-medium text-slate-500 tracking-wide uppercase mt-0.5">
          Form No. 1718 — Vehicle Booking &amp; Token Payment Receipt
        </p>
      </div>

      {/* 3. Emphasized Receipt Line */}
      <div className="my-3 p-2.5 border border-slate-900 rounded bg-slate-50/90 text-center keep-ink">
        <div className="text-[8.5pt] uppercase font-semibold text-slate-600 tracking-wider">
          Receipt Acknowledgment
        </div>
        <div className="text-[11pt] font-serif font-bold text-slate-950 mt-0.5">
          Received with thanks{" "}
          <span className="text-base font-sans font-extrabold text-slate-950 underline underline-offset-2">
            {formatCurrency(booking.amount_paid)}
          </span>{" "}
          <span className="font-normal text-slate-800 text-[10pt]">
            ({advanceInWords})
          </span>
        </div>
      </div>

      {/* 4. Particulars Table */}
      <div className="my-3 border border-slate-900 rounded overflow-hidden keep-ink">
        <table className="w-full text-left text-[9.5pt] border-collapse">
          <tbody className="divide-y divide-slate-900">
            <tr>
              <td className="w-1/3 bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Received From
              </td>
              <td className="px-3 py-1.5 font-bold uppercase text-slate-950">
                {customerName}
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Contact
              </td>
              <td className="px-3 py-1.5 font-mono text-slate-950">
                {customerPhone}
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Vehicle
              </td>
              <td className="px-3 py-1.5 font-bold uppercase text-slate-950">
                {carYearMakeModel}
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Reg. No.
              </td>
              <td className="px-3 py-1.5 font-mono font-bold uppercase text-slate-950">
                {carReg}
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Agreed Price
              </td>
              <td className="px-3 py-1.5 text-slate-950">
                <span className="font-bold font-mono">
                  {formatCurrency(booking.agreed_price)}
                </span>
                {agreedInWords ? (
                  <span className="text-[9pt] text-slate-700 ml-1.5">
                    ({agreedInWords})
                  </span>
                ) : null}
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Advance Paid
              </td>
              <td className="px-3 py-1.5 text-slate-950">
                <span className="font-bold font-mono">
                  {formatCurrency(booking.amount_paid)}
                </span>
                <span className="text-[9pt] text-slate-700 ml-1.5">
                  ({advanceInWords})
                </span>
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Balance Payable
              </td>
              <td className="px-3 py-1.5 text-slate-950">
                <span className="font-bold font-mono">
                  {formatCurrency(booking.balance_due)}
                </span>
                {balanceInWords ? (
                  <span className="text-[9pt] text-slate-700 ml-1.5">
                    ({balanceInWords})
                  </span>
                ) : null}
              </td>
            </tr>
            <tr>
              <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                Balance Within
              </td>
              <td className="px-3 py-1.5 font-bold text-slate-950">
                {balanceDaysStr}
              </td>
            </tr>
            {hasReceiptInfo && (
              <tr>
                <td className="bg-slate-100/90 px-3 py-1.5 font-serif font-bold text-slate-900 border-r border-slate-900">
                  Advance Receipt
                </td>
                <td className="px-3 py-1.5 font-mono text-slate-950">
                  No. {booking.advance_receipt_no || "—"}
                  {booking.advance_receipt_date
                    ? ` dated ${formatDateIST(booking.advance_receipt_date)}`
                    : ""}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Agreement Clauses */}
      <div className="space-y-2 text-[9.5pt] leading-snug my-3 text-slate-900">
        {/* Balance/Forfeiture clause */}
        <p className="text-justify">
          The purchaser has agreed to take delivery after full balance payment
          within the above period, failing which this agreement stands void,
          the seller is at liberty to sell the vehicle to any other party, and
          the advance paid shall be forfeited.
        </p>

        {/* Verification clause */}
        <p className="text-justify">
          The above vehicle and its documents have been duly verified, tested,
          and approved by the buyer, and the sale is hereby finalized.
        </p>

        {/* Other Requirements / Commitments */}
        <div className="pt-0.5">
          <div className="font-serif font-bold text-slate-950 uppercase text-[9pt] tracking-wide mb-0.5">
            Other Requirements &amp; Commitments:
          </div>
          <ol className="list-decimal list-inside space-y-0.5 pl-1 text-slate-900">
            <li>Documentation charges of ₹1,000 extra.</li>
            <li>
              No-claim-bonus repayment to the insurance company, if any, to be
              borne by the buyer.
            </li>
          </ol>
        </div>

        {/* Acceptance line */}
        <p className="pt-1 font-semibold text-slate-950">
          Agreed and accepted on this day of{" "}
          <span className="font-bold border-b border-slate-900 pb-0.5">
            {formatDateOrdinalIST(booking.prebooked_at)}
          </span>
          .
        </p>
      </div>

      {/* 6. Signature Grid */}
      <div className="mt-5 pt-1">
        <div className="grid grid-cols-3 gap-6 text-center text-[9pt]">
          {/* Buyer Signature */}
          <div className="flex flex-col justify-end space-y-2">
            <div className="h-10 border-b border-slate-900 flex items-end justify-center pb-0.5">
              <span className="text-[8pt] text-slate-400 italic">
                (Sign Above)
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-bold uppercase text-slate-950">
                Buyer Signature
              </div>
              <div className="text-slate-800 text-[8.5pt]">
                Name: <span className="font-bold">{customerName}</span>
              </div>
            </div>
          </div>

          {/* Seller Signature */}
          <div className="flex flex-col justify-end space-y-2">
            <div className="h-10 border-b border-slate-900 flex items-end justify-center pb-0.5">
              <span className="text-[8pt] text-slate-400 italic">
                (Authorized Stamp &amp; Sign)
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-bold uppercase text-slate-950">
                Seller Signature
              </div>
              <div className="text-slate-800 text-[8.5pt]">
                For <span className="font-bold">{sellerName}</span>
              </div>
            </div>
          </div>

          {/* Witness Signature */}
          <div className="flex flex-col justify-end space-y-2">
            <div className="h-10 border-b border-slate-900 flex items-end justify-center pb-0.5">
              <span className="text-[8pt] text-slate-400 italic">
                (Sign Above)
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="font-serif font-bold uppercase text-slate-950">
                Witness Signature
              </div>
              <div className="text-slate-800 text-[8.5pt]">
                Name: __________________
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Terms / PS Block */}
      <div className="mt-4 border border-slate-900 rounded p-2.5 bg-slate-50/60 text-[8.5pt] leading-tight space-y-1 keep-ink">
        <div className="font-serif font-bold uppercase tracking-wider text-slate-950 text-[8.5pt] border-b border-slate-400 pb-0.5 flex items-center justify-between">
          <span>Terms &amp; Conditions (P.S.)</span>
          <span className="font-mono text-[7.5pt] text-slate-600 font-normal">
            Form No. 1718
          </span>
        </div>
        <ol className="list-decimal list-inside space-y-0.5 text-slate-900">
          <li>
            All cheques/drafts in the name of{" "}
            <strong className="font-bold">&rdquo;CARS 4&#34;</strong> only;
            payment by cheque subject to realization.
          </li>
          <li>
            Minimum <strong className="font-bold">₹10,000</strong> advance
            required to keep the booking alive.
          </li>
          <li>
            Booking cancellation charges as applicable.
          </li>
        </ol>
      </div>
    </div>
  );
}

