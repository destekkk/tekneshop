import Link from "next/link";
import BuyerOffersManager from "@/components/BuyerOffersManager";
import ListingPageHeader from "@/components/ListingPageHeader";
import TekliflerimReadMarker from "@/components/TekliflerimReadMarker";
import { requireUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getOffersForBuyer } from "@/lib/offers-store";

export const metadata = { title: "Tekliflerim | TekneShop" };

export default async function TekliflerimPage() {
  const user = await requireUser("/tekliflerim");
  const offers = isDbConfigured() ? await getOffersForBuyer(user.id) : [];

  return (
    <>
      <TekliflerimReadMarker />
      <ListingPageHeader
        title="Tekliflerim"
        count={offers.length}
        countLabel="teklif"
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tekliflerim" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <p className="mb-4 text-[13px] text-muted">
          Verdiğiniz teklifler burada listelenir. İlan sahibi teklifinizi kabul ettiğinde bildirim
          alırsınız ve iletişim bilgilerine erişebilirsiniz.
        </p>
        {!isDbConfigured() ? (
          <p className="rounded-lg border border-border bg-[#fafafa] px-4 py-3 text-[13px] text-muted">
            Teklifler için veritabanı bağlantısı gerekli.
          </p>
        ) : (
          <BuyerOffersManager offers={offers} />
        )}
        <p className="mt-6">
          <Link href="/tekne" className="text-[13px] text-navy hover:underline">
            ← Tekne ilanları
          </Link>
        </p>
      </div>
    </>
  );
}
