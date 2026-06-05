import ListingPageHeader from "@/components/ListingPageHeader";

export const metadata = { title: "Giriş Yap | TekneShop" };

export default function GirisPage() {
  return (
    <>
      <ListingPageHeader
        title="Giriş Yap"
        count={0}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Giriş Yap" },
        ]}
      />
      <div className="mx-auto max-w-sm p-6">
        <form className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-medium">E-posta</label>
            <input type="email" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Şifre</label>
            <input type="password" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <button type="button" className="btn-cta w-full rounded-sm py-3 text-sm">
            Giriş (yakında)
          </button>
        </form>
      </div>
    </>
  );
}
