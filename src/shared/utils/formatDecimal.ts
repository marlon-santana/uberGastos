export function formatDecimal(value: number | string): string {
  if (typeof value === "string") value = parseFloat(value);
  if (isNaN(value)) return "";
  return value.toFixed(2).replace(".", ",");
}
