import type { MetadataRoute } from "next";
import { getMagazaCategorySlugs } from "@/lib/categories-store";
import { getSiteUrl } from "@/lib/email/config";
import { getApprovedBoatListings } from "@/lib/listings-store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [magazaSlugs, boats] = await Promise.all([
    getMagazaCategorySlugs(),
    getApprovedBoatListings(),
  ]);

  const staticPages = ["", "/tekne", "/magaza", "/ilan-ver", "/iletisim", "/giris", "/kayit"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const boatUrls = boats.map((b) => ({
    url: `${base}/tekne/ilan/${b.slug}`,
    lastModified: b.createdAt ? new Date(b.createdAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const magaza = magazaSlugs.map((slug) => ({
    url: `${base}/magaza/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...boatUrls, ...magaza];
}
