import ListingActions from "@/components/admin/ListingActions";
import ListingNoteForm from "@/components/admin/ListingNoteForm";
import StatusBadge from "@/components/admin/StatusBadge";
import { boatTypeLabels, conditionLabels, formatPrice } from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";
import type { Listing } from "@/lib/db/schema";

export default function AdminListingsTable({ rows }: { rows: Listing[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full min-w-[900px] text-left text-[13px]">
        <thead className="border-b border-border bg-[#fafafa] text-[12px] text-muted">
          <tr>
            <th className="px-3 py-2">İlan No</th>
            <th className="px-3 py-2">İlan</th>
            <th className="px-3 py-2">Durum</th>
            <th className="px-3 py-2">Kategori</th>
            <th className="px-3 py-2">Fiyat</th>
            <th className="px-3 py-2">Konum</th>
            <th className="px-3 py-2">Kaynak</th>
            <th className="px-3 py-2">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0">
              <td className="px-3 py-3 font-mono text-[12px] font-bold text-navy">
                {formatListingNumber(row.listingNumber)}
              </td>
              <td className="px-3 py-3">
                <p className="font-semibold">{row.title}</p>
                <p className="text-[11px] text-muted">{row.slug}</p>
                {row.rejectionReason ? (
                  <p className="mt-1 text-[11px] text-rose-600">Red: {row.rejectionReason}</p>
                ) : null}
              </td>
              <td className="px-3 py-3">
                <StatusBadge status={row.status} />
                {row.isFeatured ? (
                  <span className="ml-1 rounded bg-navy/10 px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                    Vitrin
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-3 text-[12px]">
                {row.type === "product"
                  ? "Ürün"
                  : row.type === "service"
                    ? "Hizmet"
                    : row.boatType
                      ? boatTypeLabels[row.boatType as keyof typeof boatTypeLabels] || row.boatType
                      : "Tekne"}
                {row.condition ? (
                  <span className="block text-[11px] text-muted">
                    {conditionLabels[row.condition as keyof typeof conditionLabels] || row.condition}
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-3">{formatPrice(row.price)}</td>
              <td className="px-3 py-3">{row.location || "—"}</td>
              <td className="px-3 py-3">{row.source || "—"}</td>
              <td className="px-3 py-3">
                <ListingActions id={row.id} status={row.status} isFeatured={row.isFeatured} />
                <ListingNoteForm id={row.id} notes={row.adminNotes} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="p-6 text-center text-[13px] text-muted">Bu sekmede ilan yok.</p>
      ) : null}
    </div>
  );
}
