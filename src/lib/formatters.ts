export function formatIndianNumber(value: string | number): string {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (isNaN(num)) return String(value);
  return num.toLocaleString("en-IN");
}
