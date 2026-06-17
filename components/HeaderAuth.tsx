import Link from "next/link";
import { getSiteConfig } from "@/lib/admin/settings";
import { getCurrentUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getUnreadListingInquiryCountForOwner } from "@/lib/listing-inquiries-store";
import { getUnreadPriceAlertCount } from "@/lib/price-history-store";
import UserLogoutButton from "@/components/UserLogoutButton";

function listingCtaLabel(freePeriod: boolean, pricingEnabled: boolean) {
  if (freePeriod || !pricingEnabled) return "Ücretsiz İlan Ver";
  return "İlan Ver";
}

export default async function HeaderAuth() {
  const [user, config] = await Promise.all([getCurrentUser(), getSiteConfig()]);
  const showListing = config.listingSubmissionEnabled !== false;
  const ctaLabel = listingCtaLabel(
    config.listingPricing.freePeriod,
    config.listingPricing.enabled,
  );

  if (user) {
    const [unreadCount, priceAlertCount] = await Promise.all([
      isDbConfigured() ? getUnreadListingInquiryCountForOwner(user.email) : 0,
      isDbConfigured() ? getUnreadPriceAlertCount(user.id) : 0,
    ]);

    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <UserLogoutButton />
          {showListing ? (
            <Link
              href="/ilan-ver"
              className="btn-navy whitespace-nowrap rounded-sm px-5 py-2 text-[14px]"
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>
        <div className="flex w-full min-w-[280px] items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/mesajlar"
              className="whitespace-nowrap border border-border px-3 py-1.5 text-[13px] text-foreground hover:border-navy hover:text-navy"
            >
              Mesajlarım
              {unreadCount > 0 ? (
                <span className="ml-1 font-bold text-rose-600">({unreadCount})</span>
              ) : null}
            </Link>
            <Link
              href="/favorilerim"
              className="whitespace-nowrap border border-border px-3 py-1.5 text-[13px] text-foreground hover:border-navy hover:text-navy"
            >
              Favorilerim
              {priceAlertCount > 0 ? (
                <span className="ml-1 font-bold text-rose-600">({priceAlertCount})</span>
              ) : null}
            </Link>
          </div>
          <span
            className="max-w-[140px] truncate text-right text-[13px] text-foreground"
            title={user.email}
          >
            {user.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/giris?tab=kayit"
        className="whitespace-nowrap px-4 py-2.5 text-[13px] text-foreground hover:text-navy"
      >
        Kayıt Ol
      </Link>
      <Link
        href="/giris"
        className="whitespace-nowrap px-4 py-2.5 text-[13px] text-foreground hover:text-navy"
      >
        Giriş Yap
      </Link>
      {showListing ? (
        <Link
          href="/ilan-ver"
          className="btn-navy whitespace-nowrap rounded-sm px-5 py-2.5 text-[14px]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
