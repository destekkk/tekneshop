import { desc } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

export const actionLabels: Record<string, string> = {
  approve: "İlan onaylandı",
  reject: "İlan reddedildi",
  delete: "İlan silindi",
  archive: "İlan arşivlendi",
  feature: "Vitrine alındı",
  unfeature: "Vitrinden çıkarıldı",
  create_ad: "Reklam eklendi",
  update_ad: "Reklam güncellendi",
  delete_ad: "Reklam silindi",
  update_settings: "Ayarlar güncellendi",
  update_package_pricing: "Paket fiyatları güncellendi",
  create_category: "Kategori eklendi",
  update_category: "Kategori güncellendi",
  delete_category: "Kategori silindi",
  create_accounting_entry: "Muhasebe kaydı",
  update_accounting_status: "Muhasebe durumu",
  delete_accounting_entry: "Muhasebe silindi",
  create_announcement: "Duyuru eklendi",
  bulk_approve: "Toplu onay",
  sync_subscribers: "E-posta listesi senkron",
  send_email_campaign: "Toplu e-posta gönderildi",
  send_test_email: "Test e-postası",
  create_user: "Kullanıcı eklendi",
  update_user: "Kullanıcı güncellendi",
  delete_user: "Kullanıcı silindi",
  create_listing_seller: "İlan veren eklendi",
  update_listing_seller: "İlan veren güncellendi",
  delete_listing_seller: "İlan veren silindi",
  sync_listing_sellers: "İlan verenler senkron",
  accept_offer: "Teklif kabul edildi",
  reject_offer: "Teklif reddedildi",
  delete_offer: "Teklif silindi",
  read_listing_inquiry: "İlan mesajı okundu",
  delete_listing_inquiry: "İlan mesajı silindi",
};

export async function getRecentActivity(limit = 30) {
  if (!isDbConfigured()) return [];
  const db = getDb();
  return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
}
