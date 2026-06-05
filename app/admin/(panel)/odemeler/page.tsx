import { getSiteConfig } from "@/lib/admin/settings";

export default async function AdminPaymentsPage() {
  const config = await getSiteConfig();
  const { packages, pricePerListing, featuredListingPrice, freePeriod, enabled } =
    config.listingPricing;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Ödemeler & Paketler</h1>
        <p className="text-[13px] text-muted">
          Ücretli ilan ve paket satışı — şu an kapalı, ücretsiz dönemde tüm ilanlar bedava.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-[12px] text-muted">Durum</p>
          <p className="mt-1 text-lg font-bold">{freePeriod ? "Ücretsiz dönem" : "Ücretli"}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-[12px] text-muted">Tek ilan</p>
          <p className="mt-1 text-lg font-bold">{pricePerListing} ₺</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-[12px] text-muted">Vitrin</p>
          <p className="mt-1 text-lg font-bold">{featuredListingPrice} ₺</p>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">İlan paketleri (planlanan)</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {packages.map((pkg) => (
            <div key={pkg.name} className="rounded border border-border p-3">
              <p className="font-semibold">{pkg.name}</p>
              <p className="text-[13px] text-muted">{pkg.count} ilan</p>
              <p className="mt-1 font-bold">{pkg.price} ₺</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-muted">
          Ödeme altyapısı (iyzico / PayTR / Stripe) entegrasyonu sonraki aşamada eklenecek.
          Şimdilik <strong>enabled={String(enabled)}</strong> — ücret tahsil edilmiyor.
        </p>
      </section>
    </div>
  );
}
