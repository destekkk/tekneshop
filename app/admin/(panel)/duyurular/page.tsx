import AnnouncementManager from "@/components/admin/AnnouncementManager";
import { getAllAnnouncements } from "@/lib/announcements-store";
import { isDbConfigured } from "@/lib/db";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Duyurular</h1>
        <p className="text-[13px] text-muted">
          Sitenin üst kısmında görünen kampanya ve bilgilendirme şeritleri
        </p>
      </div>
      <AnnouncementManager announcements={announcements} dbConnected={isDbConfigured()} />
    </div>
  );
}
