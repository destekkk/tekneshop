import IlanVerForm from "@/components/IlanVerForm";
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
      <div className="mx-auto max-w-2xl p-6">
        <IlanVerForm />
      </div>
    </>
  );
}
