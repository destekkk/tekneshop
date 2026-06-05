import Link from "next/link";
import StatCard from "@/components/admin/StatCard";
import { actionLabels, getRecentActivity } from "@/lib/activity-log-store";
import { getAdminSession } from "@/lib/admin/session";
import { getSiteConfig } from "@/lib/admin/settings";
import { isDbConfigured } from "@/lib/db";
import { getUnreadMessageCount } from "@/lib/messages-store";
import { getAdminStats } from "@/lib/listings-store";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const [stats, config, unread, activity] = await Promise.all([
    getAdminStats(),
    getSiteConfig(),
    getUnreadMessageCount(),
    getRecentActivity(8),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Özet</h1>
        <p className="text-[13px] text-muted">
          Hoş geldiniz, {session.email || "admin"}.
        </p>
      </div>

      {!isDbConfigured() ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          <strong>Neon veritabanı bağlı değil.</strong> Panel demo modda çalışıyor.
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Toplam ilan" value={stats.total} />
        <StatCard label="Onay bekleyen" value={stats.pending} tone="warning" />
        <StatCard label="Yayında" value={stats.approved} tone="success" />
        <StatCard label="Reddedilen" value={stats.rejected} tone="danger" />
        <StatCard label="Vitrin" value={stats.featured} />
        <StatCard label="Okunmamış mesaj" value={unread} tone={unread ? "warning" : "default"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-white p-4">
          <h2 className="text-sm font-bold">Hızlı işlemler</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Link href="/admin/ilanlar?tab=bekleyen" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Onay bekleyen ({stats.pending})
            </Link>
            <Link href="/admin/mesajlar" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Mesajlar ({unread} yeni)
            </Link>
            <Link href="/admin/duyurular" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Duyuru ekle
            </Link>
            <Link href="/admin/eposta" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              E-posta gönder
            </Link>
            <Link href="/admin/kategoriler" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Kategoriler
            </Link>
            <Link href="/admin/odemeler" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Paket fiyatları
            </Link>
            <Link href="/admin/muhasebe" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              Muhasebe
            </Link>
            <a href="/api/admin/export/listings" className="rounded border border-border px-3 py-2 text-[13px] hover:bg-[#fafafa]">
              İlanları CSV indir
            </a>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Son aktivite</h2>
            <Link href="/admin/aktivite" className="text-[12px] text-navy hover:underline">
              Tümü →
            </Link>
          </div>
          <ul className="mt-3 space-y-2 text-[12px]">
            {activity.map((log) => (
              <li key={log.id} className="flex justify-between gap-2 border-b border-border/60 pb-2 last:border-0">
                <span>{actionLabels[log.action] || log.action}</span>
                <span className="shrink-0 text-muted">
                  {new Date(log.createdAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                </span>
              </li>
            ))}
            {activity.length === 0 ? (
              <li className="text-muted">Henüz aktivite yok.</li>
            ) : null}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Sistem durumu</h2>
        <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
          <div className="flex justify-between">
            <dt className="text-muted">Ücretsiz dönem</dt>
            <dd>{config.listingPricing.freePeriod ? "Aktif" : "Kapalı"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Moderasyon</dt>
            <dd>{config.moderationRequired ? "Admin onayı" : "Otomatik"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Bakım modu</dt>
            <dd>{config.maintenanceMode ? "Açık" : "Kapalı"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Veritabanı</dt>
            <dd>{isDbConfigured() ? "Bağlı" : "Yok"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
