import Link from "next/link";
import { getSiteConfig } from "@/lib/admin/settings";
import { getCurrentUser } from "@/lib/auth/user-session";
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
    return (
      <>
        <span className="max-w-[140px] truncate px-2 text-[14px] text-foreground" title={user.email}>
          {user.name}
        </span>
        <Link
          href="/mesajlar"
          className="whitespace-nowrap px-3 py-2.5 text-[13px] text-foreground hover:text-navy"
        >
          Mesajlarım
        </Link>
        <UserLogoutButton />
        {showListing ? (
          <Link
            href="/ilan-ver"
            className="btn-cta whitespace-nowrap rounded-sm px-5 py-2.5 text-[14px]"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </>
    );
  }

  return (
    <>
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
          className="btn-cta whitespace-nowrap rounded-sm px-5 py-2.5 text-[14px]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </>
  );
}
