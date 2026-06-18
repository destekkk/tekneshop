import Link from "next/link";
import ListingPageHeader from "@/components/ListingPageHeader";
import MesajlarInboxTabs from "@/components/MesajlarInboxTabs";
import MesajlarReadMarker from "@/components/MesajlarReadMarker";
import SellerInquiriesManager from "@/components/SellerInquiriesManager";
import SellerOffersManager from "@/components/SellerOffersManager";
import { requireUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getListingInquiriesForOwner } from "@/lib/listing-inquiries-store";
import { getOffersForListingOwner } from "@/lib/offers-store";

export const metadata = { title: "Mesajlar ve Teklifler | TekneShop" };

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function MesajlarPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const activeTab = tab === "teklifler" ? "teklifler" : "mesajlar";
  const user = await requireUser("/mesajlar");

  const [inquiries, offers] = await Promise.all([
    isDbConfigured() ? getListingInquiriesForOwner(user.email) : [],
    isDbConfigured() ? getOffersForListingOwner(user.email) : [],
  ]);
  const pendingOfferCount = offers.filter((o) => o.status === "pending").length;

  return (
    <>
      {activeTab === "mesajlar" ? <MesajlarReadMarker /> : null}
      <ListingPageHeader
        title={activeTab === "teklifler" ? "Gelen Teklifler" : "İlan Mesajlarım"}
        count={activeTab === "teklifler" ? offers.length : inquiries.length}
        countLabel={activeTab === "teklifler" ? "teklif" : "mesaj"}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Mesajlar ve Teklifler" },
        ]}
      />
      <div className="w-full px-4 py-6 lg:pr-8">
        <p className="mb-3 text-[13px] text-muted">
          Gelen mesajlar kısa listede görünür. <strong className="text-foreground">Cevapla</strong>{" "}
          ile yanıt yazabilir; uygunsuz mesajları şikayet edebilirsiniz.
        </p>

        <MesajlarInboxTabs
          activeTab={activeTab}
          messageCount={inquiries.length}
          offerCount={offers.length}
          pendingOfferCount={pendingOfferCount}
        />

        {!isDbConfigured() ? (
          <p className="rounded-lg border border-border bg-[#fafafa] px-4 py-3 text-[13px] text-muted">
            Veritabanı bağlantısı gerekli.
          </p>
        ) : activeTab === "teklifler" ? (
          <>
            <p className="mb-4 text-[13px] text-muted">
              Kendi ilanlarınıza gelen teklifleri onaylayın veya reddedin.
              {pendingOfferCount > 0 ? (
                <>
                  {" "}
                  <strong className="text-foreground">{pendingOfferCount} bekleyen teklif</strong> var.
                </>
              ) : null}
            </p>
            <SellerOffersManager offers={offers} />
          </>
        ) : (
          <SellerInquiriesManager inquiries={inquiries} />
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
