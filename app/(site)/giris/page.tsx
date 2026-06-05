import ListingPageHeader from "@/components/ListingPageHeader";
import AuthPanel from "@/components/AuthPanel";

export const metadata = { title: "Giriş Yap / Kayıt Ol | TekneShop" };

export default async function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; redirect?: string }>;
}) {
  const { tab, redirect } = await searchParams;
  const defaultTab = tab === "kayit" ? "register" : "login";
  const redirectTo =
    redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";

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
        <AuthPanel defaultTab={defaultTab} redirectTo={redirectTo} />
      </div>
    </>
  );
}
