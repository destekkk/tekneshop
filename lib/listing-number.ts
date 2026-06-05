export const LISTING_NUMBER_START = 1_000_001;

export function formatListingNumber(n?: number | null) {
  if (!n) return "—";
  return n.toLocaleString("tr-TR");
}

export function formatListingNumberPlain(n?: number | null) {
  if (!n) return "";
  return String(n);
}
