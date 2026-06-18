import Link from "next/link";
import BuyerOffersManager from "@/components/BuyerOffersManager";
import ListingPageHeader from "@/components/ListingPageHeader";
import TekliflerimReadMarker from "@/components/TekliflerimReadMarker";
import { requireUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getOffersForBuyer } from "@/lib/offers-store";

export const metadata = { title: "Verdiğim Teklifler | TekneShop" };

export const dynamic = "force-dynamic";

export default async function TekliflerPage() {
  const user = await requireUser("/teklifler");
  const sentOffers = isDbConfigured() ? await getOffersForBuyer(user.id) : [];

  return (
    <>
      <TekliflerimReadMarker />
      <ListingPageHeader
        title="Verdiğim Teklifler"
        count={sentOffers.length}
        countLabel="teklif"
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Verdiğim Teklifler" },
        ]}
      />
      <div className="max-w-3xl px-4 py-6">
        <p className="mb-4 text-[13px] text-muted">
          Başka ilanlara verdiğiniz teklifler burada. İlan sahibi kabul ettiğinde iletişim
          bilgilerine erişebilirsiniz. İlanlarınıza gelen teklifler için{" "}
          <Link href="/mesajlar?tab=teklifler" className="font-medium text-navy hover:underline">
            Mesajlar → Gelen Teklifler
          </Link>{" "}
          sekmesine bakın.
        </p>
        {!isDbConfigured() ? (
          <p className="rounded-lg border border-border bg-[#fafafa] px-4 py-3 text-[13px] text-muted">
            Teklifler için veritabanı bağlantısı gerekli.
          </p>
        ) : (
          <BuyerOffersManager offers={sentOffers} />
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
