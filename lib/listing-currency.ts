export type ListingCurrency = "TRY" | "USD" | "EUR";

export type ExchangeRates = {
  USD: number;
  EUR: number;
};

export const listingCurrencyOptions: { value: ListingCurrency; label: string }[] = [
  { value: "TRY", label: "₺ TL" },
  { value: "USD", label: "$ USD" },
  { value: "EUR", label: "€ EUR" },
];

const currencySymbols: Record<ListingCurrency, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
};

export function parseListingCurrency(value?: string | null): ListingCurrency {
  if (value === "USD" || value === "EUR") return value;
  return "TRY";
}

export function formatListingPrice(
  amount?: number | null,
  currency: ListingCurrency = "TRY",
) {
  const n = Number(amount ?? 0);
  const formatted = n.toLocaleString("tr-TR", {
    maximumFractionDigits: currency === "TRY" ? 0 : 2,
  });
  const symbol = currencySymbols[currency];
  if (currency === "TRY") return `${formatted} ${symbol}`;
  return `${symbol} ${formatted}`;
}

export function listingPriceInTry(
  price: number,
  currency: ListingCurrency = "TRY",
  rates?: ExchangeRates,
): number {
  const amount = Number(price) || 0;
  if (currency === "TRY" || !rates) return amount;
  if (currency === "USD") return Math.round(amount * rates.USD);
  return Math.round(amount * rates.EUR);
}

export function parseListingPriceFromForm(
  formData: FormData,
): { price: number; currency: ListingCurrency } | { error: string } {
  const raw = String(formData.get("price") || "").trim();
  if (!raw) return { error: "Fiyat zorunludur." };

  const price = Number(raw);
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Geçerli bir fiyat girin." };
  }

  return {
    price: Math.round(price),
    currency: parseListingCurrency(String(formData.get("currency") || "TRY")),
  };
}
