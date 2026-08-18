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
