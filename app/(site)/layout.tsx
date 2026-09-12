import type { Metadata } from "next";
import Header from "@/components/Header";
import MaintenancePage from "@/components/MaintenancePage";
import SiteShell from "@/components/SiteShell";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getSiteConfig } from "@/lib/admin/settings";
import { getSiteUrl } from "@/lib/email/config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const siteUrl = getSiteUrl();
  return {
    title: {
      default: `${config.siteName} | Sıfır ve İkinci El Tekne İlanları`,
      template: `%s | ${config.siteName}`,
    },
    description: config.seoDescription,
    openGraph: {
      title: `${config.siteName} | Tekne İlanları`,
      description: config.seoDescription,
      url: siteUrl,
      siteName: config.siteName,
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.siteName} | Tekne İlanları`,
      description: config.seoDescription,
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  if (config.maintenanceMode) {
    return (
      <>
        <div className="sticky top-0 z-40 bg-card">
          <Header />
        </div>
        <MaintenancePage message={config.maintenanceMessage} />
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-40 bg-card">
        <Header />
      </div>
      <SiteShell>{children}</SiteShell>
      {config.whatsappNumber ? (
        <WhatsAppLink
          number={config.whatsappNumber}
          siteName={config.siteName}
          prefillMessage={config.whatsappPrefillMessage || undefined}
          variant="floating"
        />
      ) : null}
    </>
  );
}
