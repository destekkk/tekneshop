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
      <div className="flex items-center gap-1.5">
        <UserLogoutButton />
        {showListing ? (
          <Link
            href="/ilan-ver"
            className="btn-navy whitespace-nowrap rounded-sm px-4 py-1.5 text-[11px]"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href="/giris?tab=kayit"
        className="whitespace-nowrap px-3 py-2 text-[10px] text-foreground hover:text-navy"
      >
        Kayıt Ol
      </Link>
      <Link
        href="/giris"
        className="whitespace-nowrap px-3 py-2 text-[10px] text-foreground hover:text-navy"
      >
        Giriş Yap
      </Link>
      {showListing ? (
        <Link
          href="/ilan-ver"
          className="btn-navy whitespace-nowrap rounded-sm px-4 py-2 text-[11px]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
