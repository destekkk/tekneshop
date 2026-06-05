import AdForm from "@/components/admin/AdForm";
import { formatAdSchedule, getAdScheduleStatus } from "@/lib/ad-schedule";
import { getAllAds } from "@/lib/ads-store";
import { isDbConfigured } from "@/lib/db";

export default async function AdminAdsPage() {
  const ads = await getAllAds();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Reklam Yönetimi</h1>
        <p className="text-[13px] text-muted">
          Üst banner ve liste içi sponsorlu alanları yönetin. Gösterim / tıklama sayaçları ileride
          raporlara bağlanacak.
        </p>
      </div>

      {!isDbConfigured() ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
          Reklam kaydetmek için Neon veritabanı gerekli. Şu an sitede varsayılan placeholder
          reklamlar gösteriliyor.
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-bold">Yeni reklam</h2>
          <AdForm />
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-bold">Aktif reklamlar ({ads.length})</h2>
          {ads.map((ad) => {
            const status = getAdScheduleStatus(ad);
            const statusClass =
              status.tone === "success"
                ? "text-emerald-600"
                : status.tone === "warning"
                  ? "text-amber-600"
                  : status.tone === "danger"
                    ? "text-rose-600"
                    : "text-muted";
            return (
            <div key={ad.id} className="rounded-lg border border-border bg-white p-3">
              <div className="mb-2 flex items-center justify-between text-[12px]">
                <span className="font-semibold">
                  {ad.placement === "top_banner" ? "Üst banner" : `Liste içi #${ad.slot}`}
                </span>
                <span className={statusClass}>{status.label}</span>
              </div>
              <p className="text-[13px] font-medium">{ad.title}</p>
              <p className="text-[11px] text-muted">
                {ad.impressions} gösterim · {ad.clicks} tıklama · öncelik {ad.priority}
              </p>
              <p className="text-[11px] text-muted">{formatAdSchedule(ad)}</p>
              <div className="mt-3">
                <AdForm ad={ad} />
              </div>
            </div>
          );
          })}
          {ads.length === 0 ? (
            <p className="text-[13px] text-muted">Henüz kayıtlı reklam yok.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
