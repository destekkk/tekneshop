import ListingPageHeader from "@/components/ListingPageHeader";
import AuthPanel from "@/components/AuthPanel";

export const metadata = { title: "Giriş Yap / Kayıt Ol | TekneShop" };

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const defaultTab = tab === "kayit" ? "register" : "login";

  return (
    <>
      <ListingPageHeader
        title="Giriş Yap / Kayıt Ol"
        count={0}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Giriş Yap" },
        ]}
      />
      <div className="mx-auto max-w-md p-6">
        <AuthPanel defaultTab={defaultTab} />
      </div>
    </>
  );
}
