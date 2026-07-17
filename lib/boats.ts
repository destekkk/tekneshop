import type { ListingCurrency } from "@/lib/listing-currency";
import { formatListingPrice } from "@/lib/listing-currency";

export type BoatCondition = "sifir" | "ikinci-el" | "kiralik";

export type BoatType =
  | "motoryat"
  | "yelkenli"
  | "sisme-bot"
  | "jet-ski"
  | "katamaran"
  | "diger";

export type BoatListing = {
  listingNumber?: number;
  slug: string;
  title: string;
  image: string;
  condition: BoatCondition;
  boatType: BoatType;
  price: number;
  currency?: ListingCurrency;
  year: number;
  lengthM: number;
  location: string;
  engine?: string;
  badge?: string;
  createdAt?: Date;
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
  diger: "Diğer",
};

export const conditionLabels: Record<BoatCondition, string> = {
  sifir: "Sıfır",
  "ikinci-el": "İkinci El",
  kiralik: "Kiralık",
};

export function conditionLabel(value: string) {
  return conditionLabels[value as BoatCondition] ?? value;
}

export function boatTypeLabel(value: string) {
  return boatTypeLabels[value as BoatType] ?? value;
}

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
  {
    slug: "princess-v40-2018",
    title: "Princess V40 — Az Kullanılmış",
    image: boatImagePath("princess-v40-2018"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 31800000,
    year: 2018,
    lengthM: 12.98,
    location: "İstanbul, Kalamış",
    engine: "2x330 HP Volvo Penta",
    badge: "Yeni",
  },
  {
    slug: "fairline-targa-45-gt",
    title: "Fairline Targa 45 GT",
    image: boatImagePath("fairline-targa-45-gt"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 36500000,
    year: 2017,
    lengthM: 13.9,
    location: "Muğla, Yalıkavak",
    engine: "2x435 HP Volvo IPS",
  },
  {
    slug: "jeanneau-sun-odyssey-410",
    title: "Jeanneau Sun Odyssey 410",
    image: boatImagePath("jeanneau-sun-odyssey-410"),
    condition: "ikinci-el",
    boatType: "yelkenli",
    price: 17600000,
    year: 2020,
    lengthM: 12.35,
    location: "İzmir, Urla",
    engine: "Yanmar 45 HP",
  },
  {
    slug: "hanse-458-2021",
    title: "Hanse 458 — Sahibinden",
    image: boatImagePath("hanse-458-2021"),
    condition: "ikinci-el",
    boatType: "yelkenli",
    price: 19850000,
    year: 2021,
    lengthM: 14.04,
    location: "Marmaris",
    engine: "Volvo Penta 57 HP",
    badge: "Bakımlı",
  },
  {
    slug: "bali-4-1-katamaran",
    title: "Bali 4.1 Katamaran",
    image: boatImagePath("bali-4-1-katamaran"),
    condition: "ikinci-el",
    boatType: "katamaran",
    price: 28750000,
    year: 2019,
    lengthM: 12.37,
    location: "Fethiye",
    engine: "2x40 HP",
  },
  {
    slug: "fountaine-pajot-lucia-40",
    title: "Fountaine Pajot Lucia 40",
    image: boatImagePath("fountaine-pajot-lucia-40"),
    condition: "ikinci-el",
    boatType: "katamaran",
    price: 30200000,
    year: 2018,
    lengthM: 11.73,
    location: "Göcek",
    engine: "2x30 HP",
  },
  {
    slug: "monterey-295-sport-yacht",
    title: "Monterey 295 Sport Yacht",
    image: boatImagePath("monterey-295-sport-yacht"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 6250000,
    year: 2015,
    lengthM: 9.2,
    location: "Balıkesir, Ayvalık",
    engine: "2x260 HP MerCruiser",
  },
  {
    slug: "boston-whaler-270-dauntless",
    title: "Boston Whaler 270 Dauntless",
    image: boatImagePath("boston-whaler-270-dauntless"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 7900000,
    year: 2020,
    lengthM: 8.48,
    location: "Antalya, Kaş",
    engine: "2x225 HP Mercury",
  },
  {
    slug: "saxdor-320-gto",
    title: "Saxdor 320 GTO — Sıfır",
    image: boatImagePath("saxdor-320-gto"),
    condition: "sifir",
    boatType: "motoryat",
    price: 12400000,
    year: 2025,
    lengthM: 10.28,
    location: "İstanbul, Tuzla",
    engine: "2x300 HP Mercury",
    badge: "Sıfır",
  },
  {
    slug: "capelli-tempest-900-wa",
    title: "Capelli Tempest 900 WA",
    image: boatImagePath("capelli-tempest-900-wa"),
    condition: "ikinci-el",
    boatType: "sisme-bot",
    price: 5450000,
    year: 2021,
    lengthM: 9.55,
    location: "Çeşme",
    engine: "2x250 HP Yamaha",
  },
  {
    slug: "joker-boat-clubman-24",
    title: "Joker Boat Clubman 24",
    image: boatImagePath("joker-boat-clubman-24"),
    condition: "ikinci-el",
    boatType: "sisme-bot",
    price: 2350000,
    year: 2019,
    lengthM: 7.46,
    location: "Bodrum",
    engine: "Yamaha 250 HP",
  },
  {
    slug: "yamaha-fx-cruiser-svho",
    title: "Yamaha FX Cruiser SVHO",
    image: boatImagePath("yamaha-fx-cruiser-svho"),
    condition: "ikinci-el",
    boatType: "jet-ski",
    price: 1650000,
    year: 2023,
    lengthM: 3.58,
    location: "İstanbul, Pendik",
    engine: "Super Vortex High Output",
  },
  {
    slug: "sea-doo-rxt-x-300",
    title: "Sea-Doo RXT-X 300",
    image: boatImagePath("sea-doo-rxt-x-300"),
    condition: "ikinci-el",
    boatType: "jet-ski",
    price: 1890000,
    year: 2024,
    lengthM: 3.45,
    location: "Muğla, Datça",
    engine: "Rotax 1630 ACE",
    badge: "Yeni",
  },
  {
    slug: "gulet-24m-kiralik-bodrum",
    title: "24 m Gulet — Haftalık Kiralık",
    image: boatImagePath("gulet-24m-kiralik-bodrum"),
    condition: "kiralik",
    boatType: "diger",
    price: 320000,
    year: 2016,
    lengthM: 24,
    location: "Bodrum",
    engine: "2x280 HP",
    badge: "Kiralık",
  },
  {
    slug: "motoryat-18m-kiralik-gocek",
    title: "18 m Motoryat — Günlük Kiralık",
    image: boatImagePath("motoryat-18m-kiralik-gocek"),
    condition: "kiralik",
    boatType: "motoryat",
    price: 85000,
    year: 2020,
    lengthM: 18,
    location: "Göcek",
    engine: "2x600 HP",
    badge: "Kiralık",
  },
  {
    slug: "custom-line-52-trawler",
    title: "Custom Line 52 Trawler",
    image: boatImagePath("custom-line-52-trawler"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 21800000,
    year: 2014,
    lengthM: 15.85,
    location: "İstanbul, Ataköy",
    engine: "2x480 HP Cummins",
  },
  {
    slug: "dufour-390-grand-large",
    title: "Dufour 390 Grand Large",
    image: boatImagePath("dufour-390-grand-large"),
    condition: "ikinci-el",
    boatType: "yelkenli",
    price: 15400000,
    year: 2019,
    lengthM: 11.94,
    location: "Yalova",
    engine: "Volvo Penta 40 HP",
  },
  {
    slug: "greenline-39-hybrid",
    title: "Greenline 39 Hybrid",
    image: boatImagePath("greenline-39-hybrid"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 18800000,
    year: 2020,
    lengthM: 11.99,
    location: "İzmir, Çeşme",
    engine: "Volvo Penta D3 Hybrid",
    badge: "Ekonomik",
  },
  {
    slug: "cranchi-z35",
    title: "Cranchi Z35",
    image: boatImagePath("cranchi-z35"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 14250000,
    year: 2018,
    lengthM: 11.7,
    location: "Antalya",
    engine: "2x270 HP Volvo Penta",
  },
  {
    slug: "sunseeker-predator-57",
    title: "Sunseeker Predator 57",
    image: boatImagePath("sunseeker-predator-57"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 54500000,
    year: 2016,
    lengthM: 18.24,
    location: "Bodrum, Yalıkavak",
    engine: "2x900 HP Volvo",
    badge: "Vitrin",
  },
  {
    slug: "axopar-28-cabin",
    title: "Axopar 28 Cabin",
    image: boatImagePath("axopar-28-cabin"),
    condition: "ikinci-el",
    boatType: "motoryat",
    price: 8950000,
    year: 2022,
    lengthM: 8.75,
    location: "İstanbul, Tuzla",
    engine: "Mercury 300 HP",
  },
];

export function formatPrice(
  amount?: number | null,
  currency: ListingCurrency = "TRY",
) {
  return formatListingPrice(amount, currency);
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
