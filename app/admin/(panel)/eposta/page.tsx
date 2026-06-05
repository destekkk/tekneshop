import EmailManager from "@/components/admin/EmailManager";
import { getAdminSession } from "@/lib/admin/session";
import { getCampaigns } from "@/lib/email/campaigns-store";
import { isEmailConfigured } from "@/lib/email/config";
import { getSubscriberStats, getSubscribers } from "@/lib/email/subscribers-store";

export default async function AdminEmailPage() {
  const session = await getAdminSession();
  const [subscribers, campaigns, stats] = await Promise.all([
    getSubscribers(),
    getCampaigns(),
    getSubscriberStats(),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">E-posta Gönderimi</h1>
        <p className="text-[13px] text-muted">
          Kayıtlı e-posta adreslerine duyuru ve kampanya gönderin
        </p>
      </div>
      <EmailManager
        subscribers={subscribers}
        campaigns={campaigns}
        stats={stats}
        emailConfigured={isEmailConfigured()}
        adminEmail={session.email || process.env.ADMIN_EMAIL || "admin@tekneshop.com"}
      />
    </div>
  );
}
