import { getAdminStats } from "@/lib/listings-store";

export default async function AdminReportsPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Raporlar</h1>
        <p className="text-[13px] text-muted">İlan ve moderasyon özeti — detaylı analitik yakında</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Toplam ilan", stats.total],
          ["Onay bekleyen", stats.pending],
          ["Yayında", stats.approved],
          ["Vitrin", stats.featured],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-lg border border-border bg-white p-4">
            <p className="text-[12px] text-muted">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-dashed border-border bg-white p-6 text-[13px] text-muted">
        Planlanan raporlar: günlük yeni ilan, onay süresi, reklam CTR, kategori dağılımı, gelir
        (ücretli dönem), kullanıcı aktivitesi.
      </div>
    </div>
  );
}
