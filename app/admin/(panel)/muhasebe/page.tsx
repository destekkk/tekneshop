import AccountingManager from "@/components/admin/AccountingManager";
import { getAccountingEntries, getAccountingSummary } from "@/lib/accounting-store";
import { isDbConfigured } from "@/lib/db";

export default async function AdminAccountingPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const [entries, summary] = await Promise.all([
    getAccountingEntries({
      type: params.type as "income" | "expense" | undefined,
      status: params.status as "pending" | "completed" | "cancelled" | undefined,
    }),
    getAccountingSummary(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Muhasebe</h1>
        <p className="text-[13px] text-muted">
          Gelir ve gider kayıtları, ilan ücretleri, reklam gelirleri ve paket satışlarını buradan
          takip edin. Ücretli ilan sistemi açıldığında ödemeler otomatik buraya düşecek.
        </p>
      </div>

      <form method="get" className="flex flex-wrap gap-2">
        <select name="type" defaultValue={params.type || ""} className="rounded border border-border px-3 py-2 text-sm">
          <option value="">Tüm türler</option>
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>
        <select name="status" defaultValue={params.status || ""} className="rounded border border-border px-3 py-2 text-sm">
          <option value="">Tüm durumlar</option>
          <option value="completed">Tamamlandı</option>
          <option value="pending">Beklemede</option>
          <option value="cancelled">İptal</option>
        </select>
        <button type="submit" className="btn-cta rounded-sm px-4 py-2 text-sm font-bold">
          Filtrele
        </button>
      </form>

      <AccountingManager entries={entries} summary={summary} dbConnected={isDbConfigured()} />
    </div>
  );
}
