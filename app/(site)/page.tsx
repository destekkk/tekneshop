import Link from "next/link";
import BoatCard from "@/components/BoatCard";
import CsyProductCard from "@/components/CsyProductCard";
import ListingWithAds from "@/components/ListingWithAds";
import TekneCategoryLinks from "@/components/TekneCategoryLinks";
import { csyProducts } from "@/lib/csy-products";
import { getApprovedBoatListings } from "@/lib/listings-store";

export default async function HomePage() {
  const boatListings = await getApprovedBoatListings();

  return (
    <main>
      <div className="border-b border-border bg-[#fafafa] px-4 py-3">
        <h1 className="text-[15px] font-bold text-foreground">Vitrin — Tekne & Deniz İlanları</h1>
        <p className="mt-1 text-[12px] text-muted">
          Tüm kategoriler solda listelenir; istediğiniz alt kategoriye tıklayın.
        </p>
      </div>

      <section className="border-b border-border px-4 py-3">
        <h2 className="mb-2 text-[12px] font-bold text-navy">Tekne İlanları</h2>
        <TekneCategoryLinks />
      </section>

      <section>
        <div className="flex items-center justify-between border-b border-border bg-[#fafafa] px-4 py-2">
          <h2 className="text-[13px] font-bold">Son Tekne İlanları</h2>
          <Link href="/tekne" className="text-[12px] link-classified hover:underline">
            Tümünü göster
          </Link>
        </div>
        <ListingWithAds
          items={boatListings.slice(0, 8)}
          getKey={(b) => b.slug}
          renderItem={(b) => <BoatCard boat={b} />}
          every={4}
        />
      </section>

      <section>
        <div className="flex items-center justify-between border-b border-border bg-[#fafafa] px-4 py-2">
          <h2 className="text-[13px] font-bold">Sezon ürünleri</h2>
          <Link href="/magaza" className="text-[12px] link-classified hover:underline">
            Tümünü göster
          </Link>
        </div>
        <ListingWithAds
          items={csyProducts.slice(0, 12)}
          getKey={(p) => p.slug}
          renderItem={(p) => <CsyProductCard product={p} />}
          every={4}
        />
      </section>
    </main>
  );
}
