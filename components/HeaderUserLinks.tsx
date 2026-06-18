import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getUnreadListingInquiryCountForOwner } from "@/lib/listing-inquiries-store";
import { getPendingOfferCountForOwner, getUnreadBuyerOfferCount } from "@/lib/offers-store";
import { getUnreadPriceAlertCount } from "@/lib/price-history-store";

function MessageCountBadge({ unreadCount }: { unreadCount: number }) {
  if (unreadCount <= 0) return null;
  return (
    <span className="ml-1 font-bold text-red-600 group-hover:text-red-600" aria-hidden>
      ({unreadCount})
    </span>
  );
}

function AlertCountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-1 font-bold text-red-600 group-hover:text-red-600" aria-hidden>
      ({count})
    </span>
  );
}

export default async function HeaderUserLinks() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [unreadMessageCount, priceAlertCount, pendingOfferCount, unreadSentOffers] =
    await Promise.all([
      isDbConfigured() ? getUnreadListingInquiryCountForOwner(user.email) : 0,
      isDbConfigured() ? getUnreadPriceAlertCount(user.id) : 0,
      isDbConfigured() ? getPendingOfferCountForOwner(user.email) : 0,
      isDbConfigured() ? getUnreadBuyerOfferCount(user.id) : 0,
    ]);

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
      <Link
        href="/mesajlar"
        className="group whitespace-nowrap border border-border bg-card px-3 py-1.5 text-[13px] text-foreground hover:border-navy hover:text-navy"
        title="Mesajlar ve ilanlarınıza gelen teklifler"
      >
        Mesajlarım
        <MessageCountBadge unreadCount={unreadMessageCount + pendingOfferCount} />
      </Link>
      <Link
        href="/teklifler"
        className="group whitespace-nowrap border border-border bg-card px-3 py-1.5 text-[13px] text-foreground hover:border-navy hover:text-navy"
        title="Verdiğiniz teklifler"
      >
        Verdiğim Teklifler
        <AlertCountBadge count={unreadSentOffers} />
      </Link>
      <Link
        href="/favorilerim"
        className="group whitespace-nowrap border border-border bg-card px-3 py-1.5 text-[13px] text-foreground hover:border-navy hover:text-navy"
      >
        Favorilerim
        <AlertCountBadge count={priceAlertCount} />
      </Link>
      <span
        className="max-w-[220px] truncate whitespace-nowrap text-[13px] font-medium text-turquoise"
        title={user.email}
      >
        Merhaba {user.name}
      </span>
    </div>
  );
}
