import CategorySidebar from "@/components/CategorySidebar";
import SiteAnnouncement from "@/components/SiteAnnouncement";
import SiteTitleBar from "@/components/SiteTitleBar";
import TopAdBanner from "@/components/TopAdBanner";
import { getSiteConfig } from "@/lib/admin/settings";
import { getActiveTopAd } from "@/lib/ads-store";
import { getMenuSections } from "@/lib/navigation";

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const [config, topAd, menuSections] = await Promise.all([
    getSiteConfig(),
    getActiveTopAd(),
    getMenuSections(),
  ]);

  return (
    <div className="w-full flex-1">
      <CategorySidebar sections={menuSections} />
      <div className="min-w-0 bg-card ml-[220px] lg:ml-[240px]">
        <SiteAnnouncement />
        {config.adsEnabled ? (
          <TopAdBanner
            href={topAd.href}
            imageSrc={topAd.imageSrc}
            title={topAd.title}
            subtitle={topAd.subtitle}
          />
        ) : null}
        <SiteTitleBar />
        {children}
      </div>
    </div>
  );
}
