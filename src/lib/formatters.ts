export function formatIndianNumber(value: string | number): string {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (isNaN(num)) return String(value);
  return num.toLocaleString("en-IN");
}

/**
 * Formats a raw lateness duration (in total minutes) into a human-readable string.
 * Examples:
 *   45  -> "45 min Late"
 *   60  -> "1 hour Late"
 *   152 -> "2 hours 32 minutes Late"
 *   221 -> "3 hours 41 minutes Late"
 */
export function formatLateness(totalMinutes: number | undefined | null): string {
  if (!totalMinutes || totalMinutes <= 0) return "";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min Late`;
  }

  const hourStr = `${hours} ${hours === 1 ? "hour" : "hours"}`;
  if (minutes === 0) {
    return `${hourStr} Late`;
  }

  const minStr = `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
  return `${hourStr} ${minStr} Late`;
}

/**
 * Formats a UTC ISO string/Date into IST (12-hour format).
 * Example: "2026-08-21T11:30:00.000Z" -> "21 Aug 2026, 5:00 PM"
 */
export function formatISTDateTime(isoString?: string | Date | null): string {
  if (!isoString) return "";
  const dateObj = typeof isoString === "string" ? new Date(isoString) : isoString;
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Parses an IST date string ("2026-08-21") and IST time string ("17:00") into a UTC ISO string.
 * Default timeStr is "10:00" (10:00 AM IST).
 */
export function parseISTDateTimeToUTC(
  dateStr: string,
  timeStr: string = "10:00"
): string {
  if (!dateStr) return "";
  const cleanDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [year, month, day] = cleanDate.split("-").map(Number);
  const [hours, minutes] = (timeStr || "10:00").split(":").map(Number);

  // IST is UTC+5:30 -> UTC = IST - 5h 30m
  const utcMs = Date.UTC(year, month - 1, day, hours - 5, minutes - 30);
  return new Date(utcMs).toISOString();
}

/**
 * Formats an ISO timestamp to 12-hour IST time string only.
 * Example: "2026-08-21T11:30:00.000Z" -> "5:00 PM"
 */
export function formatISTTimeOnly(isoString?: string | Date | null): string {
  if (!isoString) return "";
  const dateObj = typeof isoString === "string" ? new Date(isoString) : isoString;
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a currency number in Lakhs (Lac) or Crores (Cr) with Indian notation.
 * Examples:
 *   2350000  -> "₹23.50 Lac"
 *   20430200 -> "₹2.04 Cr"
 *   57000    -> "₹57,000"
 */
export function formatLakhsCrores(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "₹0";
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (isNaN(num) || num === 0) return "₹0";

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (absNum >= 10000000) {
    const cr = absNum / 10000000;
    return `${sign}₹${cr.toFixed(2)} Cr`;
  } else if (absNum >= 100000) {
    const lac = absNum / 100000;
    return `${sign}₹${lac.toFixed(2)} Lac`;
  } else {
    return `${sign}₹${absNum.toLocaleString("en-IN")}`;
  }
}

/**
 * Returns helper label text in Lac / Cr / K for integer input fields.
 * Examples:
 *   "2350000"  -> "23.50 Lac"
 *   "20430200" -> "2.04 Cr"
 *   "57000"    -> "57 K"
 */
export function getLakhsCroresText(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (isNaN(num) || num <= 0) return "";

  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    return `${cr} Cr`;
  } else if (num >= 100000) {
    const lac = (num / 100000).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    return `${lac} Lac`;
  } else if (num >= 1000) {
    const k = (num / 1000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return `${k} K`;
  }
  return "";
}

/**
 * Formats compact text (e.g. "50k", "1.023 lac", "1.5 lac", "2 cr") for numeric amounts.
 * Examples:
 *   5000     -> "5k"
 *   50000    -> "50k"
 *   102300   -> "1.023 lac"
 *   150000   -> "1.5 lac"
 *   20000000 -> "2 cr"
 */
export function formatCompactAmount(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (isNaN(num) || num <= 0) return "";

  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    return `${cr} cr`;
  } else if (num >= 100000) {
    const lac = (num / 100000).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
    return `${lac} lac`;
  } else if (num >= 1000) {
    const k = (num / 1000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return `${k}k`;
  }
  return "";
}

