import { unstable_cache } from "next/cache";

export type TcmbRates = {
  USD: number;
  EUR: number;
  source: "tcmb" | "fallback";
  date?: string;
};

const TCMB_URL = "https://www.tcmb.gov.tr/kurlar/today.xml";
const FALLBACK_USD = Number(process.env.TCMB_FALLBACK_USD) || 35;
const FALLBACK_EUR = Number(process.env.TCMB_FALLBACK_EUR) || 38;

function parseTcmbNumber(raw: string) {
  const value = raw.trim();
  if (!value) return NaN;
  if (value.includes(",") && value.includes(".")) {
    return Number(value.replace(/\./g, "").replace(",", "."));
  }
  if (value.includes(",")) {
    return Number(value.replace(",", "."));
  }
  return Number(value);
}

function extractForexSelling(xml: string, code: "USD" | "EUR") {
  const block = xml.match(
    new RegExp(`<Currency[^>]*CurrencyCode="${code}"[\\s\\S]*?</Currency>`, "i"),
  );
  if (!block) return null;
  const rate = block[0].match(/<ForexSelling>([^<]+)<\/ForexSelling>/i);
  if (!rate) return null;
  const unitMatch = block[0].match(/<Unit>([^<]+)<\/Unit>/i);
  const unit = unitMatch ? parseTcmbNumber(unitMatch[1]) : 1;
  const selling = parseTcmbNumber(rate[1]);
  if (!Number.isFinite(selling) || !Number.isFinite(unit) || unit <= 0) return null;
  return selling / unit;
}

async function fetchTcmbRatesRaw(): Promise<TcmbRates> {
  const res = await fetch(TCMB_URL, {
    headers: { Accept: "application/xml,text/xml", "User-Agent": "TekneShop/1.0" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TCMB yanıtı: ${res.status}`);

  const xml = await res.text();
  const USD = extractForexSelling(xml, "USD");
  const EUR = extractForexSelling(xml, "EUR");
  if (!USD || !EUR) throw new Error("TCMB kurları okunamadı");

  const dateMatch = xml.match(/Date="([^"]+)"/i);
  return {
    USD,
    EUR,
    source: "tcmb",
    date: dateMatch?.[1],
  };
}

async function loadTcmbRates(): Promise<TcmbRates> {
  try {
    return await fetchTcmbRatesRaw();
  } catch {
    return {
      USD: FALLBACK_USD,
      EUR: FALLBACK_EUR,
      source: "fallback",
    };
  }
}

export const getTcmbRates = unstable_cache(loadTcmbRates, ["tcmb-rates"], {
  revalidate: 3600,
  tags: ["tcmb-rates"],
});

export function getFallbackTcmbRates(): TcmbRates {
  return {
    USD: FALLBACK_USD,
    EUR: FALLBACK_EUR,
    source: "fallback",
  };
}
