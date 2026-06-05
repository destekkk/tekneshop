import PackagePricingForm from "@/components/admin/PackagePricingForm";
import { formatMoney } from "@/lib/accounting-store";
import { getSiteConfig } from "@/lib/admin/settings";
import { isDbConfigured } from "@/lib/db";

export default async function AdminPaymentsPage() {
  const config = await getSiteConfig();
  const { packages, pricePerListing, featuredListingPrice, freePeriod, enabled } =
    config.listingPricing;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Ödemeler & Paketler</h1>
        <p className="text-[13px] text-muted">
          İlan paketi fiyatlarını, tek ilan ve vitrin ücretlerini buradan güncelleyin.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-[12px] text-muted">Durum</p>
          <p className="mt-1 text-lg font-bold">{freePeriod ? "Ücretsiz dönem" : "Ücretli"}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-[12px] text-muted">Tek ilan</p>
          <p className="mt-1 text-lg font-bold">{formatMoney(pricePerListing)}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-[12px] text-muted">Vitrin</p>
          <p className="mt-1 text-lg font-bold">{formatMoney(featuredListingPrice)}</p>
        </div>
      </div>

      <PackagePricingForm pricing={config.listingPricing} dbConnected={isDbConfigured()} />

      <section className="rounded-lg border border-dashed border-border bg-white p-4 text-[12px] text-muted">
        <p>
          <strong>Önizleme — aktif paketler:</strong>{" "}
          {packages.map((p) => `${p.name} (${p.count} ilan, ${p.price} ₺)`).join(" · ") || "Yok"}
        </p>
        <p className="mt-2">
          Ödeme altyapısı (iyzico / PayTR) sonraki aşamada bağlanacak. Şu an ücret tahsilatı:{" "}
          <strong>{enabled ? "açık (ayar)" : "kapalı"}</strong>
        </p>
      </section>
    </div>
  );
}
