"use client";

import type { BookingDetail } from "../types/booking-types";
import { numberToWordsRupees } from "../utils/number-to-words";

interface AdvanceAgreementPrintProps {
  booking: BookingDetail;
}

function formatCurrency(amountStr: string | null | undefined): string {
  if (!amountStr) return "₹0";
  const num = Number(amountStr);
  if (isNaN(num)) return amountStr;
  return `₹${num.toLocaleString("en-IN")}`;
}

function formatDateIST(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdvanceAgreementPrint({ booking }: AdvanceAgreementPrintProps) {
  const advanceInWords =
    numberToWordsRupees(booking.amount_paid) || "Zero Rupees Only";
  const agreedInWords = numberToWordsRupees(booking.agreed_price) || "";
  const balanceInWords = numberToWordsRupees(booking.balance_due);

  const customerName = booking.customer?.name || "____________________";
  const customerPhone = booking.customer?.phone || "____________________";
  const carName = booking.car
    ? `${booking.car.year} ${booking.car.make} ${booking.car.model}`
    : "Vehicle";
  const regNumber = booking.car?.reg_number || "____________________";

  const sellerName = booking.seller?.name || "Cars4 Showroom";
  const sellerAddress = booking.seller?.address || "";
  const sellerPhone = booking.seller?.phone || "";

  return (
    <div
      id="advance-agreement-print"
      className="hidden print:block font-sans text-black bg-white p-8 max-w-4xl mx-auto leading-relaxed text-sm"
    >
      {/* 1. Header Row */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight uppercase font-sans">
            {sellerName}
          </h1>
          {sellerAddress && (
            <p className="text-xs text-gray-700 max-w-md font-sans">
              {sellerAddress}
            </p>
          )}
          {sellerPhone && (
            <p className="text-xs font-mono font-semibold text-gray-800">
              Tel: {sellerPhone}
            </p>
          )}
        </div>

        <div className="text-right space-y-1 font-sans">
          <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Booking Ref No.
          </div>
          <div className="text-xl font-bold font-mono text-black border-2 border-black px-3 py-1 inline-block rounded">
            {booking.booking_number}
          </div>
          <div className="text-xs font-medium text-gray-700">
            Date: {formatDateIST(booking.prebooked_at)}
          </div>
        </div>
      </div>

      {/* 2. Document Title */}
      <div className="text-center my-6">
        <h2 className="text-lg font-bold uppercase underline tracking-wider font-sans">
          Advance Sale Agreement Cum Receipt
        </h2>
      </div>

      {/* 3. Formal Agreement Statement */}
      <div className="space-y-4 text-justify my-6 font-sans text-sm leading-7">
        <p>
          Received with thanks from Mr./Ms.{" "}
          <strong className="underline decoration-black decoration-1 uppercase">
            {customerName}
          </strong>{" "}
          (Contact: <strong className="font-mono">{customerPhone}</strong>) an advance sum of{" "}
          <strong className="font-mono">{formatCurrency(booking.amount_paid)}</strong> (in words:{" "}
          <em className="font-semibold">{advanceInWords}</em>)
          {booking.advance_receipt_no ? (
            <>
              {" "}vide Receipt/Ref No.{" "}
              <strong className="font-mono">{booking.advance_receipt_no}</strong>
              {booking.advance_receipt_date
                ? ` dated ${formatDateIST(booking.advance_receipt_date)}`
                : ""}
            </>
          ) : null}{" "}
          towards booking token for the purchase of pre-owned vehicle{" "}
          <strong className="uppercase">
            {carName}
          </strong>{" "}
          bearing Registration No.{" "}
          <strong className="font-mono uppercase">{regNumber}</strong> for a mutually agreed total deal price of{" "}
          <strong className="font-mono">{formatCurrency(booking.agreed_price)}</strong> (in words:{" "}
          <em className="font-semibold">{agreedInWords}</em>).
        </p>

        <p>
          The buyer agrees to pay the remaining balance amount of{" "}
          <strong className="font-mono">{formatCurrency(booking.balance_due)}</strong>
          {balanceInWords ? ` (${balanceInWords})` : ""}{" "}
          {booking.balance_due_days ? (
            <>
              within <strong>{booking.balance_due_days} working days</strong> from the date of this agreement
            </>
          ) : (
            <>prior to vehicle delivery</>
          )}
          .
        </p>
      </div>

      {/* 4. Financial Breakdown Summary Table */}
      <div className="my-6 border border-black rounded overflow-hidden font-sans">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-black uppercase font-bold">
              <th className="p-2 border-r border-black">Particulars</th>
              <th className="p-2 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            <tr>
              <td className="p-2 border-r border-black font-semibold">Mutually Agreed Deal Price</td>
              <td className="p-2 text-right font-mono font-bold">{formatCurrency(booking.agreed_price)}</td>
            </tr>
            <tr>
              <td className="p-2 border-r border-black font-semibold">Advance Amount Received</td>
              <td className="p-2 text-right font-mono font-bold text-emerald-700">{formatCurrency(booking.amount_paid)}</td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td className="p-2 border-r border-black uppercase">Net Balance Due</td>
              <td className="p-2 text-right font-mono text-amber-700">{formatCurrency(booking.balance_due)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. Terms & Conditions Block */}
      <div className="my-6 space-y-2 border-t border-b border-gray-300 py-4 font-sans text-xs">
        <h3 className="font-bold uppercase tracking-wider text-black">
          Terms &amp; Conditions:
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-800 leading-relaxed">
          <li>
            Ownership transfer charges, insurance transfer, and documentation fees will be borne as per mutual agreement.
          </li>
          <li>
            The advance token secures the vehicle for the balance payment period of{" "}
            {booking.balance_due_days ? `${booking.balance_due_days} working days` : "agreed timeline"}.
          </li>
          <li>
            In the event of buyer cancellation, standard processing charges / cancellation fees will be applicable as per dealership policy.
          </li>
          <li>
            All cheque / electronic fund transfers are accepted subject to bank realization.
          </li>
          <li>
            Vehicle physical possession &amp; keys will be handed over only after full settlement of the net balance due.
          </li>
        </ol>
      </div>

      {/* 6. Signature Columns */}
      <div className="mt-12 pt-8 grid grid-cols-3 gap-6 text-center font-sans text-xs">
        <div className="border-t border-black pt-2 space-y-1">
          <div className="font-bold uppercase">{customerName}</div>
          <div className="text-gray-600 text-[11px]">(Buyer Signature)</div>
        </div>

        <div className="border-t border-black pt-2 space-y-1">
          <div className="font-bold uppercase">Witness</div>
          <div className="text-gray-600 text-[11px]">(Name &amp; Signature)</div>
        </div>

        <div className="border-t border-black pt-2 space-y-1">
          <div className="font-bold uppercase">{sellerName}</div>
          <div className="text-gray-600 text-[11px]">(Authorized Signatory)</div>
        </div>
      </div>
    </div>
  );
}
