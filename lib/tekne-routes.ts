import type { BoatCondition, BoatType } from "@/lib/boats";

export type TekneFilterKey =
  | "sifir"
  | "ikinci-el"
  | "kiralik"
  | "motoryat"
  | "yelkenli"
  | "sisme-bot"
  | "jet-ski";

export const tekneFilters: Record<
  TekneFilterKey,
  { title: string; description: string; condition?: BoatCondition; boatTypes?: BoatType[] }
> = {
  sifir: {
    title: "Sıfır Tekne",
    description: "Bayi ve üretici garantili yeni tekne ilanları.",
    condition: "sifir",
  },
  "ikinci-el": {
    title: "İkinci El Tekne",
    description: "Sahibinden ve broker üzerinden satılık tekneler.",
    condition: "ikinci-el",
  },
  kiralik: {
    title: "Günlük Kiralık Tekne",
    description: "Haftalık ve günlük kiralama ilanları.",
    condition: "kiralik",
  },
  motoryat: {
    title: "Motoryat & Yat",
    description: "Motor yat, flybridge ve kabinli modeller.",
    boatTypes: ["motoryat"],
  },
  yelkenli: {
    title: "Yelkenli & Katamaran",
    description: "Yelkenli tekne ve katamaran ilanları.",
    boatTypes: ["yelkenli", "katamaran"],
  },
  "sisme-bot": {
    title: "Şişme Bot & Tender",
    description: "RIB, şişme ve yardımcı bot ilanları.",
    boatTypes: ["sisme-bot"],
  },
  "jet-ski": {
    title: "Jet Ski & PWC",
    description: "Kişisel su aracı ilanları.",
    boatTypes: ["jet-ski"],
  },
};

export function isTekneFilterKey(key: string): key is TekneFilterKey {
  return key in tekneFilters;
}
