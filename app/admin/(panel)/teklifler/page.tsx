import OffersManager from "@/components/admin/OffersManager";
import { isDbConfigured } from "@/lib/db";
import { getOffersWithDetails } from "@/lib/offers-store";

export default async function AdminOffersPage() {
  const offers = await getOffersWithDetails();
  const pending = offers.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Teklifler</h1>
        <p className="text-[13px] text-muted">
          Kayıtlı müşterilerin ilanlara verdiği teklifler
          {pending > 0 ? ` · ${pending} bekleyen` : ""}
        </p>
      </div>
      <OffersManager offers={offers} dbConnected={isDbConfigured()} />
    </div>
  );
}
