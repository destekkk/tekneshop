import ListingInquiriesManager from "@/components/admin/ListingInquiriesManager";
import MessagesManager from "@/components/admin/MessagesManager";
import { isDbConfigured } from "@/lib/db";
import { getListingInquiries } from "@/lib/listing-inquiries-store";
import { getContactMessages } from "@/lib/messages-store";

export default async function AdminMessagesPage() {
  const [messages, inquiries] = await Promise.all([getContactMessages(), getListingInquiries()]);
  const unreadContact = messages.filter((m) => !m.read).length;
  const unreadInquiries = inquiries.filter((m) => !m.read).length;
  const reportedInquiries = inquiries.filter((m) => m.reported).length;
  const unread = unreadContact + unreadInquiries;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Mesajlar</h1>
        <p className="text-[13px] text-muted">
          İletişim ve ilan mesajları {unread > 0 ? `(${unread} okunmamış)` : ""}
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-navy">
          İlan mesajları
          {unreadInquiries > 0 ? (
            <span className="ml-2 text-[12px] font-normal text-muted">({unreadInquiries} yeni)</span>
          ) : null}
        </h2>
        <p className="text-[12px] text-muted">
          Telefonu gizli ilanlara gelen mesajlar
          {reportedInquiries > 0 ? (
            <span className="ml-1 font-semibold text-rose-700">
              · {reportedInquiries} şikayet
            </span>
          ) : null}
        </p>
        <ListingInquiriesManager inquiries={inquiries} dbConnected={isDbConfigured()} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-navy">
          İletişim formu
          {unreadContact > 0 ? (
            <span className="ml-2 text-[12px] font-normal text-muted">({unreadContact} yeni)</span>
          ) : null}
        </h2>
        <MessagesManager messages={messages} dbConnected={isDbConfigured()} />
      </section>
    </div>
  );
}
