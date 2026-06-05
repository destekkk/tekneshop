export type BoatCondition = "sifir" | "ikinci-el" | "kiralik";

export type BoatType =
  | "motoryat"
  | "yelkenli"
  | "sisme-bot"
  | "jet-ski"
  | "katamaran";

export type BoatListing = {
  listingNumber?: number;
  slug: string;
  title: string;
  image: string;
  condition: BoatCondition;
  boatType: BoatType;
  price: number;
  year: number;
  lengthM: number;
  location: string;
  engine?: string;
  badge?: string;
};

/** Yerel tekne fotoğrafları: public/boats/{slug}.jpg */
export function boatImagePath(slug: string) {
  return `/boats/${slug}.jpg`;
}

export const boatTypeLabels: Record<BoatType, string> = {
  motoryat: "Motoryat & Yat",
  yelkenli: "Yelkenli",
  "sisme-bot": "Şişme Bot",
  "jet-ski": "Jet Ski & PWC",
  katamaran: "Katamaran",
};

export const conditionLabels: Record<BoatCondition, string> = {
  sifir: "Sıfır",
  "ikinci-el": "İkinci El",
  kiralik: "Kiralık",
};

export const boatListings: BoatListing[] = [
  {
    slug: "azimut-55-fly-sifir",
    title: "Azimut 55 Fly — Teslim Hazır",
    image: boatImagePath("azimut-55-fly-sifir"),
    condition: "sifir",
    boatType: "motoryat",
    price: 48500000,
    year: 2025,
    lengthM: 16.8,
    location: "İstanbul, Tuzla",
    engine: "2×800 HP",
    badge: "Vitrin",
  },
  {
    slug: "beneteau-oceanis-46",
    title: "Beneteau Oceanis 46.1",
    image: boatImagePath("beneteau-oceanis-46"),
    condition: "ikinci-el",
    boatType: "yelkenli",
    price: 12800000,
    year: 2019,
    lengthM: 14.6,
    location: "İzmir, Çeşme",
    engine: "Yanmar 57 HP",
  },
  {
    slug: "quicksilver-activ-675",
    title: "Quicksilver Activ 675 Weekend",
    image: boatImagePath("quicksilver-activ-675"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 2950000,
    year: 2021,
    lengthM: 6.75,
    location: "Muğla, Bodrum",
    engine: "Mercury 200 HP",
    badge: "Fiyat düştü",
  },
  {
    slug: "zodiac-milpro-580",
    title: "Zodiac Mil Pro 580",
    image: boatImagePath("zodiac-milpro-580"),
    condition: "sifir",
    boatType: "sisme-bot",
    price: 890000,
    year: 2024,
    lengthM: 5.8,
    location: "Antalya, Kemer",
    engine: "40 HP",
  },
  {
    slug: "sea-doo-gtx-170",
    title: "Sea-Doo GTX 170",
    image: boatImagePath("sea-doo-gtx-170"),
    condition: "ikinci-el",
    boatType: "jet-ski",
    price: 1150000,
    year: 2022,
    lengthM: 3.4,
    location: "Balıkesir, Edremit",
  },
  {
    slug: "lagoon-42-katamaran",
    title: "Lagoon 42 — Bakımlı",
    image: boatImagePath("lagoon-42-katamaran"),
    condition: "ikinci-el",
    boatType: "katamaran",
    price: 22400000,
    year: 2018,
    lengthM: 12.8,
    location: "Marmaris",
    engine: "2×45 HP",
  },
  {
    slug: "prestige-460-kiralik",
    title: "Prestige 460 — Haftalık Kiralama",
    image: boatImagePath("prestige-460-kiralik"),
    condition: "kiralik",
    boatType: "motoryat",
    price: 185000,
    year: 2023,
    lengthM: 14.2,
    location: "Göcek",
    badge: "Kiralık",
  },
  {
    slug: "bavaria-cruiser-37",
    title: "Bavaria Cruiser 37",
    image: boatImagePath("bavaria-cruiser-37"),
    condition: "sifir",
    boatType: "yelkenli",
    price: 14200000,
    year: 2025,
    lengthM: 11.4,
    location: "Yalova",
    engine: "Volvo Penta 30 HP",
  },
];

export function formatPrice(tl: number) {
  return `${tl.toLocaleString("tr-TR")} ₺`;
}

export function getBoat(slug: string) {
  return boatListings.find((b) => b.slug === slug);
}

export function filterBoats(opts: {
  condition?: BoatCondition;
  boatType?: BoatType;
}) {
  return boatListings.filter((b) => {
    if (opts.condition && b.condition !== opts.condition) return false;
    if (opts.boatType && b.boatType !== opts.boatType) return false;
    return true;
  });
}
