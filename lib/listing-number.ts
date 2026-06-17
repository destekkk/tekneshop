export const LISTING_NUMBER_MIN = 10_000;
export const LISTING_NUMBER_MAX = 99_999;

/** Demo/statik ilanlar için tutarlı 5 haneli numara */
export function demoListingNumber(seed: number) {
  const span = LISTING_NUMBER_MAX - LISTING_NUMBER_MIN + 1;
  return LISTING_NUMBER_MIN + (Math.abs(seed * 48_271) % span);
}

export function randomListingNumberCandidate() {
  const span = LISTING_NUMBER_MAX - LISTING_NUMBER_MIN + 1;
  return LISTING_NUMBER_MIN + Math.floor(Math.random() * span);
}

export function isValidListingNumber(n: number) {
  return Number.isInteger(n) && n >= LISTING_NUMBER_MIN && n <= LISTING_NUMBER_MAX;
}

export function formatListingNumber(n?: number | null) {
  if (!n) return "—";
  return String(n).padStart(5, "0");
}

export function formatListingNumberPlain(n?: number | null) {
  if (!n) return "";
  return formatListingNumber(n);
}
