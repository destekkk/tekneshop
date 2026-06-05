import Link from "next/link";
import { formatMoney, getAccountingSummary } from "@/lib/accounting-store";
import { getUnreadMessageCount } from "@/lib/messages-store";
import { getAdminStats } from "@/lib/listings-store";

export default async function AdminReportsPage() {
  const [stats, accounting, unread] = await Promise.all([
    getAdminStats(),
    getAccountingSummary(),
    getUnreadMessageCount(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Raporlar</h1>
        <p className="text-[13px] text-muted">İlan, moderasyon ve muhasebe özeti</p>
      </div>

      <section>
        <h2 className="text-sm font-bold">İlanlar</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
      </section>

      <section>
        <h2 className="text-sm font-bold">Muhasebe</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Gelir", formatMoney(accounting.income)],
            ["Gider", formatMoney(accounting.expense)],
            ["Bakiye", formatMoney(accounting.balance)],
            ["Bekleyen", formatMoney(accounting.pending)],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg border border-border bg-white p-4">
              <p className="text-[12px] text-muted">{label}</p>
              <p className="mt-1 text-xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Diğer</h2>
        <p className="mt-2 text-[13px] text-muted">
          Okunmamış iletişim mesajı: <strong>{unread}</strong>
        </p>
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Veri dışa aktarma</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="/api/admin/export/listings"
            className="rounded border border-border px-3 py-2 text-[12px] font-semibold hover:bg-[#fafafa]"
          >
            İlanları CSV indir
          </a>
          <a
            href="/api/admin/export/accounting"
            className="rounded border border-border px-3 py-2 text-[12px] font-semibold hover:bg-[#fafafa]"
          >
            Muhasebe CSV indir
          </a>
          <Link
            href="/admin/muhasebe"
            className="rounded border border-border px-3 py-2 text-[12px] font-semibold hover:bg-[#fafafa]"
          >
            Muhasebe kayıtları →
          </Link>
        </div>
      </section>
    </div>
  );
}
