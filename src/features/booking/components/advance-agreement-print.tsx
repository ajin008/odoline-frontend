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

export function AdvanceAgreementPrint({ booking }: AdvanceAgreementPrintProps) {
  const advanceInWords =
    numberToWordsRupees(booking.amount_paid) || "Zero Rupees Only";
  const agreedInWords = numberToWordsRupees(booking.agreed_price) || "";
  const balanceInWords = numberToWordsRupees(booking.balance_due) || "";

  const customerName = booking.customer?.name || "Customer";
  const customerPhone = booking.customer?.phone || "";

  const carYearMakeModel = booking.car
    ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
    : "Vehicle";
  const carReg = booking.car?.reg_number || "Unregistered";

  const sellerName = booking.seller?.name || "CARS 4 PRE OWNED CARS";
  const sellerAddress =
    booking.seller?.address || "NH Bypass, Edappally, Kochi, Kerala";
  const sellerPhone = booking.seller?.phone || "";

  const hasReceiptNo = Boolean(
    booking.advance_receipt_no && booking.advance_receipt_no.trim().length > 0
  );

  return (
    <div
      id="advance-agreement-print"
      className="hidden print:block text-slate-900 bg-white p-6 max-w-[210mm] mx-auto text-xs leading-normal font-sans select-text"
      style={{ color: "#0f172a", backgroundColor: "#ffffff" }}
    >
      {/* 1. Header Band */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-3.5">
          {/* Logo */}
          <Image
            src="/icons/icon-512.png"
            alt="Cars4 Logo"
            width={56}
            height={56}
            className="w-14 h-14 object-contain shrink-0 no-strip"
            priority
          />
          <div className="space-y-0.5">
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-slate-900 font-sans">
              {sellerName}
            </h1>
            {sellerAddress && (
              <p className="text-[11px] text-slate-700 leading-tight max-w-md">
                {sellerAddress}
              </p>
            )}
            {sellerPhone && (
              <p className="text-[11px] font-semibold text-slate-800 font-mono pt-0.5">
                Ph: {sellerPhone}
              </p>
            )}
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Agreement Ref.
          </div>
          <div className="text-sm font-bold font-mono text-slate-900 border-2 border-slate-900 px-3 py-1 inline-block rounded bg-slate-50">
            {booking.booking_number}
          </div>
        </div>
      </div>

      {/* 2. Document Title & IST Date Header */}
      <div className="text-center my-4 space-y-1">
        <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900 underline decoration-slate-900 decoration-2 underline-offset-4">
          Advance Sale Agreement Cum Receipt
        </h2>
        <div className="text-[11px] font-medium text-slate-600">
          Date &amp; Time:{" "}
          <span className="font-semibold text-slate-800 font-mono">
            {formatDateTimeIST(booking.prebooked_at)}
          </span>
        </div>
      </div>

      {/* 3. Financial Summary Bar */}
      <div className="my-4 border border-slate-900 rounded overflow-hidden text-xs">
        <div className="grid grid-cols-3 divide-x divide-slate-900 bg-slate-50/80 text-center py-2.5 font-mono">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-semibold">
              Mutually Agreed Price
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {formatCurrency(booking.agreed_price)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-semibold">
              Advance Token Received
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {formatCurrency(booking.amount_paid)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-semibold">
              Net Balance Due
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {formatCurrency(booking.balance_due)}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Formal Contract Body / Clauses */}
      <div className="space-y-3.5 text-slate-800 text-[11pt] leading-relaxed text-justify my-5 font-sans">
        {/* Receipt Paragraph */}
        <p className="p-3 bg-slate-50/50 rounded border border-slate-200">
          Received with thanks from{" "}
          <strong className="font-bold text-slate-900 uppercase">
            {customerName}
          </strong>{" "}
          {customerPhone ? (
            <>
              (Contact:{" "}
              <strong className="font-semibold font-mono text-slate-900">
                {customerPhone}
              </strong>
              ){" "}
            </>
          ) : null}
          an amount of{" "}
          <strong className="font-bold font-mono text-slate-900">
            {formatCurrency(booking.amount_paid)}
          </strong>{" "}
          (<strong>{advanceInWords}</strong>)
          {hasReceiptNo ? (
            <>
              , Receipt No.{" "}
              <strong className="font-bold font-mono text-slate-900">
                {booking.advance_receipt_no}
              </strong>
              {booking.advance_receipt_date ? (
                <>
                  {" "}
                  dated{" "}
                  <strong className="font-bold text-slate-900">
                    {formatDateIST(booking.advance_receipt_date)}
                  </strong>
                </>
              ) : null}
            </>
          ) : null}
          , being advance towards purchase/sale of{" "}
          <strong className="font-bold uppercase text-slate-900">
            {carYearMakeModel}
          </strong>{" "}
          bearing Reg. No.{" "}
          <strong className="font-bold font-mono uppercase text-slate-900">
            {carReg}
          </strong>{" "}
          for a mutually agreed price of{" "}
          <strong className="font-bold font-mono text-slate-900">
            {formatCurrency(booking.agreed_price)}
          </strong>{" "}
          (<strong>{agreedInWords}</strong>).
        </p>

        {/* Balance Clause */}
        <p className="p-3 bg-slate-50/50 rounded border border-slate-200">
          The purchaser has agreed to take delivery of the car after making
          balance payment in full, i.e.{" "}
          <strong className="font-bold font-mono text-slate-900">
            {formatCurrency(booking.balance_due)}
          </strong>{" "}
          {balanceInWords ? (
            <>
              (<strong>{balanceInWords}</strong>){" "}
            </>
          ) : null}
          within{" "}
          <strong className="font-bold text-slate-900">
            {booking.balance_due_days
              ? `${booking.balance_due_days} working days`
              : "the agreed working days"}
          </strong>
          , failing which this agreement stands void, the seller is at full
          liberty to sell the car to anyone else, and the advance amount paid
          shall be forfeited.
        </p>

        {/* Vehicle Verification & Finalization Statement */}
        <p className="px-1 text-[10.5pt] leading-snug">
          The vehicle and its documents have been duly verified, tested, and
          approved by the buyer, and the sale is hereby finalized.
        </p>

        {/* Other Requirements / Commitments */}
        <div className="px-1 text-[10.5pt] space-y-1 pt-1">
          <div className="font-bold text-slate-900 uppercase text-[10pt] tracking-wide">
            Other Requirements &amp; Commitments:
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-800 pl-1">
            <li>Documentation charges of ₹1,000 will be extra.</li>
            <li>
              No-claim-bonus (NCB) repayment to the insurance company, if any,
              to be borne by the buyer.
            </li>
          </ol>
        </div>

        {/* Acceptance Statement */}
        <p className="px-1 pt-2 text-[10.5pt] font-semibold text-slate-900">
          Agreed and accepted on this day of{" "}
          {formatDateOrdinalIST(booking.prebooked_at)}.
        </p>
      </div>

      {/* 5. Signature Grid */}
      <div className="mt-8 pt-4 border-t border-slate-300">
        <div className="grid grid-cols-3 gap-6 text-center font-sans text-xs">
          {/* Buyer Signature */}
          <div className="space-y-5">
            <div className="h-10 flex items-end justify-center">
              <div className="w-4/5 border-b border-dashed border-slate-400" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold uppercase text-slate-900">
                Buyer Signature
              </div>
              <div className="text-slate-700 text-[11px]">
                Name:{" "}
                <span className="font-semibold text-slate-900">
                  {customerName}
                </span>
              </div>
            </div>
          </div>

          {/* Seller Signature */}
          <div className="space-y-5">
            <div className="h-10 flex items-end justify-center">
              <div className="w-4/5 border-b border-dashed border-slate-400" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold uppercase text-slate-900">
                Authorized Signatory
              </div>
              <div className="text-slate-700 text-[11px]">
                For{" "}
                <span className="font-semibold text-slate-900">
                  {sellerName}
                </span>
              </div>
            </div>
          </div>

          {/* Witness Signature */}
          <div className="space-y-5">
            <div className="h-10 flex items-end justify-center">
              <div className="w-4/5 border-b border-dashed border-slate-400" />
            </div>
            <div className="space-y-0.5">
              <div className="font-bold uppercase text-slate-900">
                Witness Signature
              </div>
              <div className="text-slate-700 text-[11px]">
                Name: __________________
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PS / Terms Block */}
      <div className="mt-6 border border-slate-900 rounded p-3 bg-slate-50/70 text-[9.5pt] leading-tight space-y-1">
        <div className="font-bold uppercase tracking-wider text-slate-900 text-[10pt] border-b border-slate-300 pb-1 mb-1.5 flex items-center justify-between">
          <span>Important Terms &amp; Conditions (P.S.)</span>
          <span className="text-[8.5pt] text-slate-500 font-mono normal-case">
            Form No. 1718
          </span>
        </div>
        <ol className="list-decimal list-inside space-y-1 text-slate-800">
          <li>
            All cheques / drafts to be drawn in the name of{" "}
            <strong>&rdquo;CARS 4&#34;</strong> only; payment by cheque is
            subject to bank realization.
          </li>
          <li>
            Buyer must pay a minimum of <strong>₹10,000</strong> as advance to
            keep the booking alive.
          </li>
          <li>
            Booking cancellation charge is <strong>₹3,000</strong>.
          </li>
        </ol>
      </div>
    </div>
  );
}
