import CategorySidebar from "@/components/CategorySidebar";
import SiteAnnouncement from "@/components/SiteAnnouncement";
import TopAdBanner from "@/components/TopAdBanner";
import { getActiveTopAd } from "@/lib/ads-store";
import { getMenuSections } from "@/lib/navigation";

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const [topAd, menuSections] = await Promise.all([getActiveTopAd(), getMenuSections()]);

  return (
    <div className="w-full flex-1">
      <CategorySidebar sections={menuSections} />
      <div className="min-w-0 bg-card ml-[220px] lg:ml-[240px]">
        <SiteAnnouncement />
        <TopAdBanner
          href={topAd.href}
          imageSrc={topAd.imageSrc}
          title={topAd.title}
          subtitle={topAd.subtitle}
        />
        {children}
      </div>
    </div>
  );
}
