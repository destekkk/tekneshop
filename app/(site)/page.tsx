import Link from "next/link";
import BoatCard from "@/components/BoatCard";
import CsyProductCard from "@/components/CsyProductCard";
import HomeHero from "@/components/HomeHero";
import HomeSellerCta from "@/components/HomeSellerCta";
import HomeTrustStrip from "@/components/HomeTrustStrip";
import JsonLd from "@/components/JsonLd";
import ListingWithAds from "@/components/ListingWithAds";
import TekneCategoryLinks from "@/components/TekneCategoryLinks";
import { getSiteUrl } from "@/lib/email/config";
import { csyProducts } from "@/lib/csy-products";
import { formatPrice } from "@/lib/boats";
import { getApprovedBoatListings } from "@/lib/listings-store";

export default async function HomePage() {
  const boatListings = await getApprovedBoatListings();
  const featured = boatListings.slice(0, 8);
  const siteUrl = getSiteUrl();

  const itemListLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "TekneShop",
        url: siteUrl,
        description:
          "Sıfır ve ikinci el tekne ilanları. Doğrudan satıcıya mesaj ve teklif sistemi.",
      },
      {
        "@type": "ItemList",
        name: "TekneShop Vitrin İlanları",
        itemListElement: featured.map((boat, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}/tekne/ilan/${boat.slug}`,
          name: boat.title,
          image: boat.image.startsWith("http") ? boat.image : `${siteUrl}${boat.image}`,
        })),
      },
    ],
  };

  return (
    <main>
      <JsonLd data={itemListLd} />
      <HomeHero />

      <section className="border-b border-border px-4 py-4 sm:px-6">
        <h2 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-navy">
          Hızlı seçim
        </h2>
        <TekneCategoryLinks />
      </section>

      <section>
        <div className="flex items-center justify-between border-b border-border bg-[#fafafa] px-4 py-2.5 sm:px-6">
          <div>
            <h2 className="text-[14px] font-bold text-foreground">Vitrin ilanları</h2>
            <p className="text-[11px] text-muted">
              {featured.length > 0
                ? `${boatListings.length} onaylı ilandan seçmeler`
                : "Yeni ilanlar yakında"}
            </p>
          </div>
          <Link href="/tekne" className="text-[12px] font-medium link-classified hover:underline">
            Tümünü göster
          </Link>
        </div>
        {featured.length > 0 ? (
          <ListingWithAds
            items={featured}
            getKey={(b) => b.slug}
            renderItem={(b) => <BoatCard boat={b} />}
            every={4}
          />
        ) : (
          <p className="px-4 py-10 text-center text-[13px] text-muted">
            Henüz yayınlanmış tekne ilanı yok.{" "}
            <Link href="/ilan-ver" className="font-medium text-navy hover:underline">
              İlk ilanı siz verin
            </Link>
          </p>
        )}
      </section>

      <HomeTrustStrip />
      <HomeSellerCta />

      <section>
        <div className="flex items-center justify-between border-b border-border bg-[#fafafa] px-4 py-2.5 sm:px-6">
          <h2 className="text-[14px] font-bold">Sezon ürünleri</h2>
          <Link href="/magaza" className="text-[12px] link-classified hover:underline">
            Mağazaya git
          </Link>
        </div>
        <ListingWithAds
          items={csyProducts.slice(0, 8)}
          getKey={(p) => p.slug}
          renderItem={(p) => <CsyProductCard product={p} />}
          every={4}
        />
      </section>

      {/* SSR hint for crawlers — fiyat örnekleri */}
      <p className="sr-only">
        Örnek vitrin:{" "}
        {featured
          .slice(0, 3)
          .map((b) => `${b.title} ${formatPrice(b.price)}`)
          .join("; ")}
      </p>
    </main>
  );
}
