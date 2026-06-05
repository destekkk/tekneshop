import ListingActions from "@/components/admin/ListingActions";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/boats";
import { getAdminListings } from "@/lib/listings-store";

export default async function AdminPendingListingsPage() {
  const rows = await getAdminListings({ status: "pending" });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Onay Bekleyen İlanlar</h1>
        <p className="text-[13px] text-muted">
          Kullanıcı veya import ile gelen ilanları inceleyin, onaylayın veya reddedin.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold">{row.title}</h2>
                  <StatusBadge status={row.status} />
                </div>
                <p className="mt-1 text-[13px] text-muted">
                  {formatPrice(row.price)} · {row.location || "Konum yok"} · {row.condition} /{" "}
                  {row.boatType}
                </p>
                {row.description ? (
                  <p className="mt-2 text-[13px]">{row.description}</p>
                ) : null}
                <p className="mt-2 text-[12px] text-muted">
                  İletişim: {row.contactName || "—"} · {row.contactPhone || "—"} ·{" "}
                  {row.contactEmail || "—"}
                </p>
              </div>
              <ListingActions id={row.id} status={row.status} isFeatured={row.isFeatured} />
            </div>
          </article>
        ))}
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-white p-8 text-center text-[13px] text-muted">
            Onay bekleyen ilan yok.
          </div>
        ) : null}
      </div>
    </div>
  );
}
