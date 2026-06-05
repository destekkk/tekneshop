import SellersManager from "@/components/admin/SellersManager";
import { isDbConfigured } from "@/lib/db";
import { getListingSellers } from "@/lib/sellers-store";

export default async function AdminListingSellersPage() {
  const sellers = await getListingSellers();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">İlan Verenler</h1>
        <p className="text-[13px] text-muted">
          İlan sahiplerini ekleyin, güncelleyin veya mevcut ilanlardan aktarın
        </p>
      </div>
      <SellersManager sellers={sellers} dbConnected={isDbConfigured()} />
    </div>
  );
}
