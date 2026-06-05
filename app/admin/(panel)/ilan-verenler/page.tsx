import Link from "next/link";
import SellersManager from "@/components/admin/SellersManager";
import { isDbConfigured } from "@/lib/db";
import { getListingSellers } from "@/lib/sellers-store";

export default async function AdminListingSellersPage() {
  const sellers = await getListingSellers();
  const dbConnected = isDbConfigured();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">İlan Verenler</h1>
          <p className="text-[13px] text-muted">
            İlan sahiplerini ekleyin, güncelleyin veya mevcut ilanlardan aktarın
          </p>
        </div>
        <Link
          href="/admin/ilanlar"
          className="rounded border border-border px-3 py-2 text-[12px] font-semibold hover:bg-[#fafafa]"
        >
          Tüm İlanlar →
        </Link>
      </div>

      <SellersManager sellers={sellers} dbConnected={dbConnected} />
    </div>
  );
}
