/** [CSY Marine](https://www.csymarine.com/) kategori ağacı — TekneShop menüleri */

export type CsySubCategory = {

  slug: string;

  label: string;

  /** Farklı ana kategoriye yönlendiren alt bağlantılar (ör. Boya/Bakım) */

  href?: string;

};



export type CsyMainCategory = {

  slug: string;

  label: string;

  children: CsySubCategory[];

};



const tekneMalzemeleriChildren: CsySubCategory[] = [

  { slug: "bas-pervanesi", label: "Baş Pervanesi" },

  { slug: "boya-bakim", label: "Boya / Bakım", href: "/magaza/boya-bakim" },

  { slug: "duzen-kumanda", label: "Dümen / Kumanda" },

  { slug: "demirleme", label: "Demirleme / Rıhtım" },

  { slug: "elektrik", label: "Elektrik", href: "/magaza/elektrik" },

  { slug: "guvenlik", label: "Güvenlik" },

  { slug: "guverte", label: "Güverte" },

  { slug: "havalandirma", label: "Havalandırma" },

  { slug: "kabin", label: "Kabin" },

  { slug: "navigasyon", label: "Navigasyon" },

  { slug: "tuvalet-pis-su", label: "Atık Su / Tuvalet" },

  { slug: "sintine-pompalari", label: "Sintine Pompaları" },

  { slug: "tatli-su", label: "Tatlı Su" },

  { slug: "usturmaça", label: "Usturmaça ve Ekipmanı" },

  { slug: "yakit-sistemi", label: "Yakıt Sistemi" },

  { slug: "hidrofor-pompalari", label: "Hidrofor Pompaları" },

  { slug: "motor-aksami", label: "Motor Aksamı", href: "/magaza/motor-aksami" },

  { slug: "mutfak", label: "Mutfak Malzemeleri" },

  { slug: "yelken", label: "Yelken" },

  { slug: "aydinlatma", label: "Aydınlatma", href: "/magaza/aydinlatma" },

];



export const csyCategories: CsyMainCategory[] = [

  {

    slug: "tekne-malzemeleri",

    label: "Tekne Malzemeleri",

    children: tekneMalzemeleriChildren,

  },

  {

    slug: "aydinlatma",

    label: "Aydınlatma",

    children: [

      { slug: "dis-aydinlatma", label: "Dış Aydınlatma" },

      { slug: "ic-aydinlatma", label: "İç Aydınlatma" },

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
      { slug: "balik-bulucular", label: "Balık Bulucular" },
      { slug: "marin-muzik-sistemleri", label: "Marin Müzik Sistemleri" },
      { slug: "marin-hoparlorler", label: "Marin Hoparlörler" },
      { slug: "marin-telsizler", label: "Marin Telsizler" },
      { slug: "anten", label: "Anten" },
      { slug: "dynaplate", label: "Dynaplate" },
      { slug: "derinlik-gostergesi", label: "Derinlik Göstergesi" },
      { slug: "marin-amfiler", label: "Marin Amfiler" },
      { slug: "marin-kameralar", label: "Marin Kameralar" },
      { slug: "oto-pilot", label: "Oto Pilot" },
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



/** Sol menüde ayrı başlık olarak gösterilmeyen mağaza kategorileri (Tekne Malzemeleri altında linklenir) */

export const csySidebarHiddenSlugs = new Set(["aydinlatma"]);



export function getCsyMain(slug: string) {

  return csyCategories.find((c) => c.slug === slug);

}



export function getCsySub(mainSlug: string, subSlug: string) {

  return getCsyMain(mainSlug)?.children.find((c) => c.slug === subSlug);

}



export function magazaHref(main: string, sub?: string) {

  return sub ? `/magaza/${main}/${sub}` : `/magaza/${main}`;

}



export function csySubHref(mainSlug: string, sub: CsySubCategory) {

  return sub.href ?? magazaHref(mainSlug, sub.slug);

}


