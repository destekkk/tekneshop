import ListingPageHeader from "@/components/ListingPageHeader";

export const metadata = { title: "İlan Ver | TekneShop" };

export default function IlanVerPage() {
  return (
    <>
      <ListingPageHeader
        title="Ücretsiz İlan Ver"
        count={0}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İlan Ver" },
        ]}
      />
      <div className="mx-auto max-w-lg p-6">
        <form className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-medium">İlan türü</label>
            <select className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm">
              <option>Tekne satışı</option>
              <option>Parça & ekipman</option>
              <option>Hizmet</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Başlık</label>
            <input
              type="text"
              placeholder="Örn. 2021 model motoryat"
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <button
            type="button"
            className="btn-cta w-full rounded-sm py-3 text-sm"
          >
            Devam et (yakında)
          </button>
        </form>
      </div>
    </>
  );
}
