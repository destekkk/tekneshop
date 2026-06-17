import IlanVerForm from "@/components/IlanVerForm";
import ListingPageHeader from "@/components/ListingPageHeader";
import { getSiteConfig } from "@/lib/admin/settings";
import { requireUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getUserById } from "@/lib/users-store";
import Link from "next/link";

export const metadata = { title: "İlan Ver | TekneShop" };

export default async function IlanVerPage() {
  const [user, config] = await Promise.all([requireUser("/ilan-ver"), getSiteConfig()]);

  if (!config.listingSubmissionEnabled) {
    return (
      <>
        <ListingPageHeader
          title="İlan Ver"
          count={0}
          crumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "İlan Ver" },
          ]}
        />
        <div className="mx-auto max-w-lg p-6 text-center">
          <p className="rounded-xl border border-border bg-[#fafafa] px-6 py-8 text-[14px] text-muted">
            İlan verme şu an kapalıdır. Daha sonra tekrar deneyin.
          </p>
          <Link href="/tekne" className="mt-4 inline-block text-[13px] text-navy hover:underline">
            ← Tekne ilanlarına dön
          </Link>
        </div>
      </>
    );
  }

  const profile = isDbConfigured() ? await getUserById(user.id) : null;
  const pageTitle =
    config.listingPricing.freePeriod || !config.listingPricing.enabled
      ? "Ücretsiz İlan Ver"
      : "İlan Ver";

  return (
    <>
      <ListingPageHeader
        title={pageTitle}
        count={0}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: pageTitle },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        {!config.listingPricing.freePeriod && config.listingPricing.enabled ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
            İlan ücreti: <strong>{config.listingPricing.pricePerListing.toLocaleString("tr-TR")} ₺</strong>
            {config.listingPricing.featuredListingPrice > 0 ? (
              <>
                {" "}
                · Vitrin:{" "}
                <strong>
                  {config.listingPricing.featuredListingPrice.toLocaleString("tr-TR")} ₺
                </strong>
              </>
            ) : null}
          </p>
        ) : null}
        <p className="mb-4 rounded-lg border border-border bg-[#fafafa] px-4 py-3 text-[13px] text-muted">
          İlan veriyorsunuz: <strong className="text-navy">{profile?.name ?? user.name}</strong> (
          {profile?.email ?? user.email})
        </p>
        <IlanVerForm
          user={{
            name: profile?.name ?? user.name,
            email: profile?.email ?? user.email,
            phone: profile?.phone ?? null,
          }}
        />
      </div>
    </>
  );
}
