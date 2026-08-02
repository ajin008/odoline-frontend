const LAKH = 1_00_000;
const CRORE = 1_00_00_000;

/**
 * Formats a rupee amount into the Indian lakh/crore short form used across
 * the dashboard (e.g. 4450200 -> "₹44.5 lac", 21000000 -> "₹2.1 cr").
 * Values under ₹1,00,000 fall back to a plain "en-IN" grouped number.
 */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= CRORE) {
    return `${sign}₹${trimDecimal(abs / CRORE)} cr`;
  }
  if (abs >= LAKH) {
    return `${sign}₹${trimDecimal(abs / LAKH)} lac`;
  }
  return `${sign}₹${abs.toLocaleString("en-IN")}`;
}

/** Full, exact rupee amount (e.g. "₹44,50,200") — use as a hover/title value. */
export function formatFullCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}₹${Math.abs(value).toLocaleString("en-IN")}`;
}

function trimDecimal(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "");
}
