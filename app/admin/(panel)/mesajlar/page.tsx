import MessagesManager from "@/components/admin/MessagesManager";
import { isDbConfigured } from "@/lib/db";
import { getContactMessages } from "@/lib/messages-store";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Mesajlar</h1>
        <p className="text-[13px] text-muted">
          İletişim formundan gelen talepler {unread > 0 ? `(${unread} okunmamış)` : ""}
        </p>
      </div>
      <MessagesManager messages={messages} dbConnected={isDbConfigured()} />
    </div>
  );
}
