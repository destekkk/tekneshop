import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import {
  getListingInquiryCountForOwner,
  getUnreadListingInquiryCountForOwner,
} from "@/lib/listing-inquiries-store";
import { getUnreadPriceAlertCount } from "@/lib/price-history-store";

function MessageCountBadge({
  unreadCount,
  totalCount,
}: {
  unreadCount: number;
  totalCount: number;
}) {
  if (unreadCount > 0) {
    return (
      <span className="ml-1 font-bold text-red-600 group-hover:text-red-600" aria-hidden>
        ({unreadCount})
      </span>
    );
  }
  if (totalCount > 0) {
    return (
      <span className="ml-1 font-bold text-foreground group-hover:text-navy" aria-hidden>
        ({totalCount})
      </span>
    );
  }
  return null;
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

  const [unreadCount, totalCount, priceAlertCount] = await Promise.all([
    isDbConfigured() ? getUnreadListingInquiryCountForOwner(user.email) : 0,
    isDbConfigured() ? getListingInquiryCountForOwner(user.email) : 0,
    isDbConfigured() ? getUnreadPriceAlertCount(user.id) : 0,
  ]);

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
      <Link
        href="/mesajlar"
        className="group whitespace-nowrap border border-border bg-card px-3 py-1.5 text-[13px] text-foreground hover:border-navy hover:text-navy"
      >
        Mesajlarım
        <MessageCountBadge unreadCount={unreadCount} totalCount={totalCount} />
      </Link>
      <Link
        href="/favorilerim"
        className="group whitespace-nowrap border border-border bg-card px-3 py-1.5 text-[13px] text-foreground hover:border-navy hover:text-navy"
      >
        Favorilerim
        <AlertCountBadge count={priceAlertCount} />
      </Link>
      <span
        className="max-w-[160px] truncate text-[13px] font-medium text-foreground"
        title={user.email}
      >
        {user.name}
      </span>
    </div>
  );
}
