import AdminSidebar from "@/components/admin/AdminSidebar";
import { getUnreadMessageCount } from "@/lib/messages-store";
import { getAdminStats } from "@/lib/listings-store";

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const [stats, unread] = await Promise.all([getAdminStats(), getUnreadMessageCount()]);

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <AdminSidebar pendingCount={stats.pending} unreadCount={unread} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
