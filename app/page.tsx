import Link from "next/link";
import BoatCard from "@/components/BoatCard";
import CsyProductCard from "@/components/CsyProductCard";
import ListingWithAds from "@/components/ListingWithAds";
import { boatListings } from "@/lib/boats";
import { csyProducts } from "@/lib/csy-products";
import { menuSections } from "@/lib/navigation";

export default function HomePage() {
  const tekneSection = menuSections[0];

  return (
    <main>
      <div className="border-b border-border bg-[#fafafa] px-4 py-3">
        <h1 className="text-[15px] font-bold text-foreground">Vitrin — Tekne & Deniz İlanları</h1>
        <p className="mt-1 text-[12px] text-muted">
          Tüm kategoriler solda listelenir; istediğiniz alt kategoriye tıklayın.
        </p>
      </div>

      <section className="border-b border-border px-4 py-4">
        <h2 className="mb-3 text-[13px] font-bold text-navy">{tekneSection.label}</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {tekneSection.children.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded border border-border bg-[#fafafa] px-3 py-2.5 text-[13px] text-link hover:bg-[#f0f0f0] hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>
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
          <h2 className="text-[13px] font-bold">CSY Marine — Sezon ürünleri</h2>
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
