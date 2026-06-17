import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getAdminSession } from "@/lib/admin/session";
import { getUnreadListingInquiryCount } from "@/lib/listing-inquiries-store";
import { getUnreadMessageCount } from "@/lib/messages-store";
import { getPendingOfferCount } from "@/lib/offers-store";
import { getAdminStats } from "@/lib/listings-store";

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  let stats = { pending: 0 };
  let unread = 0;
  let pendingOffers = 0;
  try {
    [stats, unread, pendingOffers] = await Promise.all([
      getAdminStats(),
      Promise.all([getUnreadMessageCount(), getUnreadListingInquiryCount()]).then(
        ([a, b]) => a + b,
      ),
      getPendingOfferCount(),
    ]);
  } catch {
    // DB veya ağ hatasında panel çökmesin
  }

  const session = await getAdminSession();

  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <AdminSidebar
        pendingCount={stats.pending}
        unreadCount={unread}
        pendingOfferCount={pendingOffers}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar email={session.email} unreadCount={unread} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
