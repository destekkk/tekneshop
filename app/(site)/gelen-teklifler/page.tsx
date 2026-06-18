import Link from "next/link";
import ListingPageHeader from "@/components/ListingPageHeader";
import SellerOffersManager from "@/components/SellerOffersManager";
import { requireUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getOffersForListingOwner } from "@/lib/offers-store";

export const metadata = { title: "Gelen Teklifler | TekneShop" };

export const dynamic = "force-dynamic";

export default async function GelenTekliflerPage() {
  const user = await requireUser("/gelen-teklifler");
  const offers = isDbConfigured() ? await getOffersForListingOwner(user.email) : [];
  const pendingCount = offers.filter((o) => o.status === "pending").length;

  return (
    <>
      <ListingPageHeader
        title="Gelen Teklifler"
        count={offers.length}
        countLabel="teklif"
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Gelen Teklifler" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <p className="mb-4 text-[13px] text-muted">
          İlanlarınıza gelen teklifleri buradan kabul veya reddedebilirsiniz.
          {pendingCount > 0 ? (
            <>
              {" "}
              <strong className="text-foreground">{pendingCount} bekleyen teklif</strong> var.
            </>
          ) : null}
        </p>
        {!isDbConfigured() ? (
          <p className="rounded-lg border border-border bg-[#fafafa] px-4 py-3 text-[13px] text-muted">
            Teklifler için veritabanı bağlantısı gerekli.
          </p>
        ) : (
          <SellerOffersManager offers={offers} />
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
