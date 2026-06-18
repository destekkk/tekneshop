import Link from "next/link";
import BuyerOffersManager from "@/components/BuyerOffersManager";
import ListingPageHeader from "@/components/ListingPageHeader";
import SellerOffersManager from "@/components/SellerOffersManager";
import TekliflerInboxTabs from "@/components/TekliflerInboxTabs";
import TekliflerimReadMarker from "@/components/TekliflerimReadMarker";
import { requireUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getOffersForBuyer, getOffersForListingOwner } from "@/lib/offers-store";

export const metadata = { title: "Teklifler | TekneShop" };

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function TekliflerPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab = tab === "gelen" ? "gelen" : "verdigim";
  const user = await requireUser("/teklifler");

  const [sentOffers, receivedOffers] = await Promise.all([
    isDbConfigured() ? getOffersForBuyer(user.id) : [],
    isDbConfigured() ? getOffersForListingOwner(user.email) : [],
  ]);
  const pendingReceivedCount = receivedOffers.filter((o) => o.status === "pending").length;
  const unreadSentCount = sentOffers.filter(
    (o) => !o.buyerRead && (o.status === "accepted" || o.status === "countered"),
  ).length;

  return (
    <>
      {activeTab === "verdigim" ? <TekliflerimReadMarker /> : null}
      <ListingPageHeader
        title={activeTab === "gelen" ? "İlanlarıma Gelen Teklifler" : "Verdiğim Teklifler"}
        count={activeTab === "gelen" ? receivedOffers.length : sentOffers.length}
        countLabel="teklif"
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Teklifler" },
        ]}
      />
      <div className="max-w-3xl px-4 py-6">
        <TekliflerInboxTabs
          activeTab={activeTab}
          sentCount={sentOffers.length}
          receivedCount={receivedOffers.length}
          pendingReceivedCount={pendingReceivedCount}
          unreadSentCount={unreadSentCount}
        />

        {!isDbConfigured() ? (
          <p className="rounded-lg border border-border bg-[#fafafa] px-4 py-3 text-[13px] text-muted">
            Teklifler için veritabanı bağlantısı gerekli.
          </p>
        ) : activeTab === "gelen" ? (
          <>
            {pendingReceivedCount > 0 ? (
              <p className="mb-4 text-[13px] text-muted">
                <strong className="text-foreground">{pendingReceivedCount} bekleyen teklif</strong>{" "}
                var — ilan sahibi olarak onaylayın veya reddedin.
              </p>
            ) : null}
            <SellerOffersManager offers={receivedOffers} />
          </>
        ) : (
          <>
            <p className="mb-4 text-[13px] text-muted">
              Alıcı olarak verdiğiniz teklifler burada. Kabul edildiğinde iletişim bilgilerine
              erişebilirsiniz.
            </p>
            <BuyerOffersManager offers={sentOffers} />
          </>
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
