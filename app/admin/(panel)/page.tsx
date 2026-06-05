import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import { getAdminSession } from "@/lib/admin/session";
import { getSiteConfig } from "@/lib/admin/settings";
import { isDbConfigured } from "@/lib/db";
import { getAdminStats } from "@/lib/listings-store";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const stats = await getAdminStats();
  const config = await getSiteConfig();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Özet</h1>
        <p className="text-[13px] text-muted">
          Hoş geldiniz, {session.email || "admin"}. Tüm moderasyon ve reklam işlemleri buradan
          yönetilir.
        </p>
      </div>

      {!isDbConfigured() ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          <strong>Neon veritabanı bağlı değil.</strong> Panel demo modda çalışıyor; onay/silme
          işlemleri için Vercel&apos;de <code>DATABASE_URL</code> tanımlayın ve{" "}
          <code>npm run db:push</code> çalıştırın.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Toplam ilan" value={stats.total} />
        <StatCard label="Onay bekleyen" value={stats.pending} tone="warning" />
        <StatCard label="Yayında" value={stats.approved} tone="success" />
        <StatCard label="Reddedilen" value={stats.rejected} tone="danger" />
        <StatCard label="Vitrin" value={stats.featured} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-white p-4">
          <h2 className="text-sm font-bold">Hızlı işlemler</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Link href="/admin/ilanlar/bekleyen" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Onay bekleyen ilanlar ({stats.pending})
            </Link>
            <Link href="/admin/ilanlar" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Tüm ilanları yönet
            </Link>
            <Link href="/admin/reklamlar" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Reklam alanları
            </Link>
            <Link href="/admin/ayarlar" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Site ayarları
            </Link>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-white p-4">
          <h2 className="text-sm font-bold">İlan ücretlendirme</h2>
          <dl className="mt-3 space-y-2 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-muted">Durum</dt>
              <dd className="font-semibold">
                {config.listingPricing.freePeriod ? "Ücretsiz dönem aktif" : "Ücretli"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Ücretli ilan (gelecek)</dt>
              <dd>{config.listingPricing.enabled ? "Açık" : "Kapalı"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">İlan başı ücret</dt>
              <dd>{config.listingPricing.pricePerListing} ₺</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Moderasyon</dt>
              <dd>{config.moderationRequired ? "Admin onayı gerekli" : "Otomatik yayın"}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
