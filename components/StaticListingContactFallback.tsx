import Link from "next/link";
import WhatsAppLink from "@/components/WhatsAppLink";
import type { SiteConfig } from "@/lib/admin/settings";

type Props = {
  config: SiteConfig;
  listingTitle: string;
  listingUrl: string;
  listingNumber?: number;
};

export default function StaticListingContactFallback({
  config,
  listingTitle,
  listingUrl,
  listingNumber,
}: Props) {
  const hasWhatsApp = Boolean(config.whatsappNumber);
  const hasPhone = Boolean(config.supportPhone);
  const hasEmail = Boolean(config.supportEmail);

  return (
    <div className="w-full rounded-lg border border-border bg-white p-4">
      <p className="text-[13px] font-semibold text-navy">İletişim</p>
      <p className="mt-1 text-[13px] text-muted">
        Bu vitrin ilanı için doğrudan mesaj gönderilemiyor. TekneShop üzerinden iletişime geçin.
      </p>
      {hasPhone ? (
        <p className="mt-3 text-[13px]">
          <span className="text-muted">Telefon:</span>{" "}
          <a href={`tel:${config.supportPhone.replace(/\s/g, "")}`} className="font-semibold text-navy hover:underline">
            {config.supportPhone}
          </a>
        </p>
      ) : null}
      {hasEmail ? (
        <p className="mt-2 text-[13px]">
          <span className="text-muted">E-posta:</span>{" "}
          <a href={`mailto:${config.supportEmail}`} className="font-semibold text-navy hover:underline">
            {config.supportEmail}
          </a>
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        {hasWhatsApp ? (
          <WhatsAppLink
            number={config.whatsappNumber}
            siteName={config.siteName}
            prefillMessage={config.whatsappPrefillMessage || undefined}
            context="listing"
            listingTitle={listingTitle}
            listingUrl={listingUrl}
            listingNumber={listingNumber}
            variant="button"
            label={`${config.siteName} üzerinden sor`}
          />
        ) : null}
        <Link href="/iletisim" className="btn-navy inline-flex w-auto rounded-sm px-4 py-2 text-[13px] font-bold">
          İletişim sayfası
        </Link>
      </div>
    </div>
  );
}
