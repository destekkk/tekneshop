import { Suspense } from "react";
import AdminListingsTable from "@/components/admin/AdminListingsTable";
import AdminPendingListings from "@/components/admin/AdminPendingListings";
import ListingCategoryTabs from "@/components/admin/ListingCategoryTabs";
import ListingsTabs, { parseListingTab } from "@/components/admin/ListingsTabs";
import { isDbConfigured } from "@/lib/db";
import {
  countByCategory,
  getListingCategoryFilter,
  parseListingCategory,
} from "@/lib/listing-filters";
import { getAdminListings, getAdminStats } from "@/lib/listings-store";

const tabTitles = {
  tumu: "Tüm İlanlar",
  bekleyen: "Onay Bekleyen",
  onayli: "Onaylı",
  reddedilen: "Reddedilmiş",
};

const tabDescriptions = {
  tumu: "Tüm ilanları görüntüleyin, kategori ve arama ile filtreleyin",
  bekleyen: "Gelen ilanları inceleyin, onaylayın veya reddedin",
  onayli: "Yayında olan onaylı ilanlar",
  reddedilen: "Reddedilen ilanlar ve red sebepleri",
};

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tab?: string; kategori?: string }>;
}) {
  const params = await searchParams;
  const tab = parseListingTab(params.tab);
  const kategori = parseListingCategory(params.kategori);
  const categoryFilter = getListingCategoryFilter(kategori);

  const statusMap = {
    tumu: undefined,
    bekleyen: "pending" as const,
    onayli: "approved" as const,
    reddedilen: "rejected" as const,
  };

  const status = statusMap[tab];

  const [rows, stats, allForCounts] = await Promise.all([
    getAdminListings({
      search: params.q,
      status,
      boatType: categoryFilter.boatType,
      condition: categoryFilter.condition,
      type: categoryFilter.type,
    }),
    getAdminStats(),
    getAdminListings({ status }),
  ]);

  const categoryCounts = countByCategory(allForCounts);
  const dbError = stats.dbError && isDbConfigured();

  const counts = {
    tumu: stats.total,
    bekleyen: stats.pending,
    onayli: stats.approved,
    reddedilen: stats.rejected,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy">Tüm İlanlar</h1>
          <p className="text-[13px] text-muted">{tabDescriptions[tab]}</p>
        </div>
        <a
          href="/api/admin/export/listings"
          className="rounded border border-border px-3 py-2 text-[12px] font-semibold hover:bg-[#fafafa]"
        >
          CSV indir
        </a>
      </div>

      {dbError ? (
        <div className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-[13px] text-rose-900">
          <strong>Veritabanı güncellemesi gerekli.</strong> İlanlar yüklenemedi. Bilgisayarınızda{" "}
          <code className="rounded bg-rose-100 px-1">npm run db:push</code> çalıştırın (Neon bağlantısı
          ile). Bu komut eksik tabloları ve ilan numarası kolonunu ekler.
        </div>
      ) : null}

      {!isDbConfigured() ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          Demo mod — canlı ilanlar için <code>DATABASE_URL</code> tanımlayın.
        </div>
      ) : null}

      <Suspense fallback={<div className="h-10 animate-pulse rounded bg-[#eee]" />}>
        <ListingsTabs active={tab} counts={counts} searchQuery={params.q} />
      </Suspense>

      <Suspense fallback={<div className="h-16 animate-pulse rounded bg-[#eee]" />}>
        <ListingCategoryTabs
          activeCategory={kategori}
          activeTab={tab}
          counts={categoryCounts}
          searchQuery={params.q}
        />
      </Suspense>

      <h2 className="text-sm font-bold text-navy">
        {tabTitles[tab]}
        {kategori ? ` · ${categoryFilter.label}` : ""}
        <span className="ml-2 font-normal text-muted">({rows.length})</span>
      </h2>

      <form method="get" className="flex flex-wrap gap-2">
        {tab !== "tumu" ? <input type="hidden" name="tab" value={tab} /> : null}
        {kategori ? <input type="hidden" name="kategori" value={kategori} /> : null}
        <input
          name="q"
          defaultValue={params.q}
          placeholder="İlan no, başlık, konum veya slug ara"
          className="min-w-[220px] flex-1 rounded border border-border px-3 py-2 text-sm"
        />
        <button type="submit" className="btn-cta rounded-sm px-4 py-2 text-sm font-bold">
          Ara
        </button>
      </form>

      {tab === "bekleyen" ? (
        <AdminPendingListings rows={rows} />
      ) : (
        <AdminListingsTable rows={rows} />
      )}
    </div>
  );
}
