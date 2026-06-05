/** [CSY Marine](https://www.csymarine.com/) kategori ağacı — TekneShop menüleri */
export type CsySubCategory = {
  slug: string;
  label: string;
};

export type CsyMainCategory = {
  slug: string;
  label: string;
  children: CsySubCategory[];
};

export const csyCategories: CsyMainCategory[] = [
  {
    slug: "aydinlatma",
    label: "Aydınlatma",
    children: [
      { slug: "dis-aydinlatma", label: "Dış Aydınlatma" },
      { slug: "ic-aydinlatma", label: "İç Aydınlatma" },
    ],
  },
  {
    slug: "tekne-malzemeleri",
    label: "Tekne Malzemeleri",
    children: [
      { slug: "tuvalet-pis-su", label: "Tuvalet - Pis Su" },
      { slug: "usturmaça", label: "Usturmaça ve Ekipmanı" },
      { slug: "mutfak", label: "Mutfak Malzemeleri & Gereçleri" },
      { slug: "duzen-kumanda", label: "Dümen - Kumanda" },
      { slug: "guvenlik", label: "Güvenlik" },
      { slug: "navigasyon", label: "Navigasyon" },
      { slug: "demirleme", label: "Demirleme - Rıhtım" },
      { slug: "guverte", label: "Güverte" },
      { slug: "yelken", label: "Yelken" },
    ],
  },
  {
    slug: "boya-bakim",
    label: "Boya - Bakım",
    children: [
      { slug: "zehirli-boya", label: "Zehirli Boya" },
      { slug: "epoksi", label: "Epoksi" },
      { slug: "yapisitirici", label: "Yapıştırıcılar ve Sızdırmazlık" },
      { slug: "temizlik-kimyasal", label: "Temizlik - Bakım Kimyasalları" },
      { slug: "sintine-boyasi", label: "Sintine Boyası" },
      { slug: "tik-bakim", label: "Tik Temizlik ve Bakımı" },
    ],
  },
  {
    slug: "elektrik",
    label: "Elektrik",
    children: [
      { slug: "aku", label: "Akü" },
      { slug: "sarj-ekipmani", label: "Şarj Ekipmanları" },
      { slug: "sahil-besleme", label: "Sahil Besleme Ekipmanı" },
      { slug: "kablo", label: "Kablo ve Ekipmanları" },
    ],
  },
  {
    slug: "elektronik",
    label: "Elektronik",
    children: [
      { slug: "oto-pilot", label: "Oto Pilot" },
      { slug: "hoparlor", label: "Hoparlör" },
      { slug: "chartplotter", label: "Chartplotter" },
      { slug: "radar", label: "Radar" },
      { slug: "radyo", label: "Radyo - CD Çalar" },
    ],
  },
  {
    slug: "spor-outdoor",
    label: "Spor - Outdoor",
    children: [
      { slug: "can-yeleği", label: "Can Yeleği" },
      { slug: "paddleboard", label: "Paddleboard" },
      { slug: "su-kayagi", label: "Su Kayağı" },
      { slug: "dalis", label: "Dalış Malzemeleri" },
    ],
  },
  {
    slug: "sisme-bot",
    label: "Şişme Bot",
    children: [{ slug: "tum-urunler", label: "Tüm Şişme Bot Ürünleri" }],
  },
  {
    slug: "motor-aksami",
    label: "Motor ve Aksamı",
    children: [
      { slug: "motor-yagi", label: "Motor Yağı" },
      { slug: "pervane", label: "Pervane" },
      { slug: "dis-takma", label: "Dıştan Takma Motor" },
      { slug: "filtre", label: "Deniz Suyu Filtresi" },
    ],
  },
  {
    slug: "karavan",
    label: "Karavan",
    children: [{ slug: "tum-urunler", label: "Karavan Ürünleri" }],
  },
];

export function getCsyMain(slug: string) {
  return csyCategories.find((c) => c.slug === slug);
}

export function getCsySub(mainSlug: string, subSlug: string) {
  return getCsyMain(mainSlug)?.children.find((c) => c.slug === subSlug);
}

export function magazaHref(main: string, sub?: string) {
  return sub ? `/magaza/${main}/${sub}` : `/magaza/${main}`;
}
