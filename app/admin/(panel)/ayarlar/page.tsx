import { saveSettingsAction } from "@/lib/admin/actions";
import { getSiteConfig } from "@/lib/admin/settings";
import { isDbConfigured } from "@/lib/db";

export default async function AdminSettingsPage() {
  const config = await getSiteConfig();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Site Ayarları</h1>
        <p className="text-[13px] text-muted">
          Moderasyon, ücretsiz dönem ve ileride aktif edilecek ücretli ilan ayarları
        </p>
      </div>

      <form action={saveSettingsAction} className="space-y-6 rounded-lg border border-border bg-white p-5">
        <section className="space-y-3">
          <h2 className="text-sm font-bold">Genel</h2>
          <div>
            <label className="text-[12px] font-medium">Site adı</label>
            <input
              name="siteName"
              defaultValue={config.siteName}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium">Destek e-posta</label>
            <input
              name="supportEmail"
              defaultValue={config.supportEmail}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium">Destek telefon</label>
            <input
              name="supportPhone"
              defaultValue={config.supportPhone}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium">WhatsApp numarası</label>
            <input
              name="whatsappNumber"
              defaultValue={config.whatsappNumber}
              placeholder="905xxxxxxxxx"
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-[11px] text-muted">
              cokusta.com ile aynı numara kullanılabilir — aşağıdaki ön mesaj sayesinde hangi siteden
              yazıldığı belli olur.
            </p>
          </div>
          <div>
            <label className="text-[12px] font-medium">WhatsApp ön mesajı (TekneShop)</label>
            <textarea
              name="whatsappPrefillMessage"
              rows={3}
              defaultValue={
                config.whatsappPrefillMessage ||
                "Merhaba, *TekneShop* (tekneshop.com) üzerinden yazıyorum."
              }
              placeholder="Merhaba, *TekneShop* (tekneshop.com) üzerinden yazıyorum."
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-[11px] text-muted">
              Kullanıcı WhatsApp&apos;a tıklayınca bu metin otomatik yazılır. cokusta.com&apos;da farklı
              bir metin kullanın.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="text-[12px] font-medium">SEO açıklama</label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={config.seoDescription}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input name="maintenanceMode" type="checkbox" defaultChecked={config.maintenanceMode} />
            Bakım modu (site ziyaretçilere kapalı mesajı)
          </label>
          <div className="sm:col-span-2">
            <label className="text-[12px] font-medium">Bakım mesajı</label>
            <input
              name="maintenanceMessage"
              defaultValue={config.maintenanceMessage}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="moderationRequired"
              type="checkbox"
              defaultChecked={config.moderationRequired}
            />
            Yeni ilanlar admin onayından geçsin
          </label>
          <div>
            <label className="text-[12px] font-medium">İlan başına max fotoğraf</label>
            <input
              name="maxPhotosPerListing"
              type="number"
              defaultValue={config.maxPhotosPerListing}
              className="mt-1 w-32 rounded border border-border px-3 py-2 text-sm"
            />
          </div>
        </section>

        <section className="space-y-3 border-t border-border pt-4">
          <h2 className="text-sm font-bold">İlan ücretlendirme (ileride)</h2>
          <p className="text-[12px] text-muted">
            Şimdilik ücretsiz dönem açık. Ücretli ilanı açmadan önce ödeme entegrasyonu
            gerekecek.
          </p>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="freePeriod"
              type="checkbox"
              defaultChecked={config.listingPricing.freePeriod}
            />
            Ücretsiz dönem aktif (şu an önerilen)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              name="pricingEnabled"
              type="checkbox"
              defaultChecked={config.listingPricing.enabled}
            />
            Ücretli ilan sistemini etkinleştir (ileride)
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[12px] font-medium">İlan başı ücret (₺)</label>
              <input
                name="pricePerListing"
                type="number"
                defaultValue={config.listingPricing.pricePerListing}
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium">Vitrin ücreti (₺)</label>
              <input
                name="featuredListingPrice"
                type="number"
                defaultValue={config.listingPricing.featuredListingPrice}
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <p className="text-[12px] text-muted">
            Paket fiyatlarını düzenlemek için{" "}
            <a href="/admin/odemeler" className="font-semibold text-navy hover:underline">
              Ödemeler & Paketler
            </a>{" "}
            sayfasını kullanın.
          </p>
        </section>

        <button
          type="submit"
          disabled={!isDbConfigured()}
          className="btn-cta rounded-sm px-5 py-2.5 text-sm font-bold disabled:opacity-50"
        >
          Ayarları kaydet
        </button>
      </form>
    </div>
  );
}
