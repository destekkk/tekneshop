import ListingActions from "@/components/admin/ListingActions";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/boats";
import { getAdminListings } from "@/lib/listings-store";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const rows = await getAdminListings({
    search: params.q,
    status: params.status as "pending" | "approved" | "rejected" | "archived" | undefined,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Tüm İlanlar</h1>
        <p className="text-[13px] text-muted">Onaylama, vitrin, arşivleme ve silme işlemleri</p>
      </div>

      <form method="get" className="flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Başlık, konum veya slug ara"
          className="min-w-[220px] flex-1 rounded border border-border px-3 py-2 text-sm"
        />
        <select name="status" defaultValue={params.status || ""} className="rounded border border-border px-3 py-2 text-sm">
          <option value="">Tüm durumlar</option>
          <option value="pending">Onay bekleyen</option>
          <option value="approved">Yayında</option>
          <option value="rejected">Reddedilen</option>
          <option value="archived">Arşiv</option>
        </select>
        <button type="submit" className="btn-cta rounded-sm px-4 py-2 text-sm font-bold">
          Filtrele
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="border-b border-border bg-[#fafafa] text-[12px] text-muted">
            <tr>
              <th className="px-3 py-2">İlan</th>
              <th className="px-3 py-2">Durum</th>
              <th className="px-3 py-2">Fiyat</th>
              <th className="px-3 py-2">Konum</th>
              <th className="px-3 py-2">Kaynak</th>
              <th className="px-3 py-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0">
                <td className="px-3 py-3">
                  <p className="font-semibold">{row.title}</p>
                  <p className="text-[11px] text-muted">{row.slug}</p>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={row.status} />
                  {row.isFeatured ? (
                    <span className="ml-1 rounded bg-navy/10 px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                      Vitrin
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-3">{formatPrice(row.price)}</td>
                <td className="px-3 py-3">{row.location || "—"}</td>
                <td className="px-3 py-3">{row.source || "—"}</td>
                <td className="px-3 py-3">
                  <ListingActions id={row.id} status={row.status} isFeatured={row.isFeatured} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? (
          <p className="p-6 text-center text-[13px] text-muted">İlan bulunamadı.</p>
        ) : null}
      </div>
    </div>
  );
}
