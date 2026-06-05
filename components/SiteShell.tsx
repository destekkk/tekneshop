import CategorySidebar from "@/components/CategorySidebar";
import TopAdBanner from "@/components/TopAdBanner";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex-1">
      <CategorySidebar />
      <div className="min-w-0 bg-card ml-[220px] lg:ml-[240px]">
        <TopAdBanner />
        {children}
      </div>
    </div>
  );
}
