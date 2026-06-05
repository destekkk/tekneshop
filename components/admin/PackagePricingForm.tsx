"use client";

import { useState, useTransition } from "react";
import { savePackagesPricingAction } from "@/lib/admin/actions";
import type { ListingPricingSettings } from "@/lib/admin/settings";

type Props = {
  pricing: ListingPricingSettings;
  dbConnected: boolean;
};

type PackageRow = { name: string; count: number; price: number };

export default function PackagePricingForm({ pricing, dbConnected }: Props) {
  const [packages, setPackages] = useState<PackageRow[]>(pricing.packages);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function updatePackage(index: number, field: keyof PackageRow, value: string) {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === index
          ? {
              ...p,
              [field]: field === "name" ? value : Number(value) || 0,
            }
          : p,
      ),
    );
    setSaved(false);
  }

  function addPackage() {
    setPackages((prev) => [...prev, { name: "Yeni Paket", count: 1, price: 0 }]);
    setSaved(false);
  }

  function removePackage(index: number) {
    setPackages((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  return (
    <form
      action={(fd) => {
        fd.set("packagesJson", JSON.stringify(packages));
        start(async () => {
          await savePackagesPricingAction(fd);
          setSaved(true);
        });
      }}
      className="space-y-6"
    >
      {!dbConnected ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
          Fiyatları kaydetmek için Neon veritabanı bağlantısı gerekli.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input name="freePeriod" type="checkbox" defaultChecked={pricing.freePeriod} />
          Ücretsiz dönem aktif
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="pricingEnabled" type="checkbox" defaultChecked={pricing.enabled} />
          Ücretli ilan sistemi açık
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[12px] font-medium">Tek ilan fiyatı (₺)</label>
          <input
            name="pricePerListing"
            type="number"
            min={0}
            defaultValue={pricing.pricePerListing}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium">Vitrin ücreti (₺)</label>
          <input
            name="featuredListingPrice"
            type="number"
            min={0}
            defaultValue={pricing.featuredListingPrice}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <section className="rounded-lg border border-border bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">İlan paketleri</h2>
          <button
            type="button"
            onClick={addPackage}
            className="rounded border border-border px-3 py-1 text-[12px] font-semibold hover:bg-[#fafafa]"
          >
            + Paket ekle
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="grid gap-2 rounded border border-border bg-[#fafafa] p-3 sm:grid-cols-[1fr_100px_120px_auto]"
            >
              <div>
                <label className="text-[11px] text-muted">Paket adı</label>
                <input
                  value={pkg.name}
                  onChange={(e) => updatePackage(index, "name", e.target.value)}
                  className="mt-0.5 w-full rounded border border-border px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted">İlan adedi</label>
                <input
                  type="number"
                  min={1}
                  value={pkg.count}
                  onChange={(e) => updatePackage(index, "count", e.target.value)}
                  className="mt-0.5 w-full rounded border border-border px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted">Fiyat (₺)</label>
                <input
                  type="number"
                  min={0}
                  value={pkg.price}
                  onChange={(e) => updatePackage(index, "price", e.target.value)}
                  className="mt-0.5 w-full rounded border border-border px-2 py-1.5 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removePackage(index)}
                  className="rounded border border-rose-200 px-2 py-1.5 text-[11px] text-rose-700 hover:bg-rose-50"
                >
                  Sil
                </button>
              </div>
              {pkg.count > 0 && pkg.price > 0 ? (
                <p className="text-[11px] text-muted sm:col-span-4">
                  İlan başı: {Math.round(pkg.price / pkg.count).toLocaleString("tr-TR")} ₺
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {packages.length === 0 ? (
          <p className="mt-3 text-[13px] text-muted">Henüz paket yok. &quot;+ Paket ekle&quot; ile başlayın.</p>
        ) : null}
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || !dbConnected}
          className="btn-cta rounded-sm px-5 py-2.5 text-sm font-bold disabled:opacity-50"
        >
          {pending ? "Kaydediliyor…" : "Fiyatları kaydet"}
        </button>
        {saved ? <span className="text-[13px] font-medium text-emerald-700">Kaydedildi ✓</span> : null}
      </div>
    </form>
  );
}
