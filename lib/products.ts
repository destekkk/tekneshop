import { listingImage, partImages } from "@/lib/images";

export type Product = {
  slug: string;
  name: string;
  image: string;
  category: string;
  categorySlug: string;
  price: number;
  description: string;
  condition?: "sifir" | "ikinci-el";
  badge?: string;
};

export const categories = [
  { slug: "motor-yakit", name: "Motor & Yakıt", icon: "⚙️" },
  { slug: "guvenlik", name: "Güvenlik & Can Kurtarma", icon: "🛟" },
  { slug: "navigasyon", name: "Navigasyon & Elektronik", icon: "🧭" },
  { slug: "bakim", name: "Bakım & Kimyasal", icon: "🧴" },
  { slug: "konfor", name: "Konfor & Elektrik", icon: "💡" },
  { slug: "pervane", name: "Pervane & Aktarma", icon: "🔩" },
] as const;

export const products: Product[] = [
  {
    slug: "2-zamanli-motor-yagi-4l",
    name: "2 Zamanlı Motor Yağı 4L",
    image: listingImage(partImages.motor),
    category: "Motor & Yakıt",
    categorySlug: "motor-yakit",
    price: 1890,
    description: "Dıştan takma motorlar için TC-W3 onaylı sentetik karışım.",
    condition: "sifir",
    badge: "Çok satan",
  },
  {
    slug: "can-yelegi-150n",
    name: "Can Yeleği 150N Otomatik",
    image: listingImage(partImages.guvenlik),
    category: "Güvenlik & Can Kurtarma",
    categorySlug: "guvenlik",
    price: 4250,
    description: "ISO 12402-3, hafif gövde, CE işaretli.",
    condition: "sifir",
  },
  {
    slug: "gps-plotter-7",
    name: 'GPS Plotter 7"',
    image: listingImage(partImages.navigasyon),
    category: "Navigasyon & Elektronik",
    categorySlug: "navigasyon",
    price: 12800,
    description: "Türkiye haritalı, sonar uyumlu, dokunmatik ekran.",
    condition: "ikinci-el",
  },
  {
    slug: "tekne-temizlik-seti",
    name: "Tekne Temizlik Seti",
    image: listingImage(partImages.bakim),
    category: "Bakım & Kimyasal",
    categorySlug: "bakim",
    price: 890,
    description: "Gövde şampuanı, cilalı koruma ve mikrofiber set.",
    condition: "sifir",
  },
  {
    slug: "led-borda-lambasi",
    name: "LED Borda Lambası Çift",
    image: listingImage(partImages.elektrik),
    category: "Konfor & Elektrik",
    categorySlug: "konfor",
    price: 1450,
    description: "12V, IP67, paslanmaz gövde.",
    condition: "sifir",
  },
  {
    slug: "pervane-yedek-set",
    name: "Pervane Yedek Set (Çoklu Ölçü)",
    image: listingImage(partImages.pervane),
    category: "Pervane & Aktarma",
    categorySlug: "pervane",
    price: 2100,
    description: "Popüler motor markalarıyla uyumlu 3'lü paket.",
    condition: "ikinci-el",
  },
  {
    slug: "dizel-filtre-seti",
    name: "Dizel Yakıt Filtre Seti",
    image: listingImage(partImages.motor, 400, 300),
    category: "Motor & Yakıt",
    categorySlug: "motor-yakit",
    price: 3200,
    description: "Su ayırıcılı, OEM uyumlu kartuş filtre paketi.",
    condition: "sifir",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function formatPrice(tl: number) {
  return `${tl.toLocaleString("tr-TR")} ₺`;
}
