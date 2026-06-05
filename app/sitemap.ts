import type { MetadataRoute } from "next";
import { getMagazaCategorySlugs } from "@/lib/categories-store";
import { boatListings } from "@/lib/boats";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://tekneshop.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const magazaSlugs = await getMagazaCategorySlugs();
  const staticPages = ["", "/tekne", "/magaza", "/ilan-ver", "/iletisim", "/giris", "/kayit"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const boats = boatListings.map((b) => ({
    url: `${BASE}/tekne/ilan/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const magaza = magazaSlugs.map((slug) => ({
    url: `${BASE}/magaza/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...boats, ...magaza];
}
