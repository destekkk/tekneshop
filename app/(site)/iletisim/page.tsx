import ContactForm from "@/components/ContactForm";
import ListingPageHeader from "@/components/ListingPageHeader";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getSiteConfig } from "@/lib/admin/settings";

export const metadata = { title: "İletişim | TekneShop" };

export default async function IletisimPage() {
  const config = await getSiteConfig();

  return (
    <>
      <ListingPageHeader
        title="İletişim"
        count={0}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İletişim" },
        ]}
      />
      <div className="mx-auto grid max-w-4xl gap-6 p-6 lg:grid-cols-2">
        <div className="space-y-3 text-[13px]">
          <h2 className="font-bold text-navy">Bize ulaşın</h2>
          <p className="text-muted">
            İlan, reklam, teknik destek ve iş birliği talepleriniz için formu doldurun veya doğrudan
            yazın.
          </p>
          <dl className="space-y-2">
            <div>
              <dt className="font-medium">E-posta</dt>
              <dd>{config.supportEmail}</dd>
            </div>
            {config.supportPhone ? (
              <div>
                <dt className="font-medium">Telefon</dt>
                <dd>{config.supportPhone}</dd>
              </div>
            ) : null}
            {config.whatsappNumber ? (
              <div>
                <dt className="font-medium">{config.siteName} WhatsApp</dt>
                <dd className="space-y-1">
                  <WhatsAppLink
                    number={config.whatsappNumber}
                    siteName={config.siteName}
                    prefillMessage={config.whatsappPrefillMessage || undefined}
                    context="contact"
                    label={`${config.siteName} üzerinden yaz`}
                  />
                  <p className="text-[11px] text-muted">{config.whatsappNumber}</p>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
