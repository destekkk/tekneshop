import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MaintenancePage from "@/components/MaintenancePage";
import SiteShell from "@/components/SiteShell";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getSiteConfig } from "@/lib/admin/settings";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    title: `${config.siteName} | Tekne İlanları ve Denizcilik Parçaları`,
    description: config.seoDescription,
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-40 bg-card">
        <Header />
      </div>
      <SiteShell>{children}</SiteShell>
      <Footer />
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
