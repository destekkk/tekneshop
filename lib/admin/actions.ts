"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/admin/activity";
import { getSiteConfig, saveSiteConfig, type SiteConfig } from "@/lib/admin/settings";
import { getAdminSession, requireAdmin } from "@/lib/admin/session";
import { parseAdScheduleFromForm } from "@/lib/ad-schedule";
import { deleteAd, upsertAd, type AdPlacement } from "@/lib/ads-store";
import { isDbConfigured } from "@/lib/db";
import {
  createAccountingEntry,
  deleteAccountingEntry,
  updateAccountingStatus,
  type AccountingCategory,
  type AccountingType,
} from "@/lib/accounting-store";
import {
  deleteAnnouncement,
  upsertAnnouncement,
} from "@/lib/announcements-store";
import {
  createContactMessage,
  deleteMessage,
  markMessageRead,
} from "@/lib/messages-store";
import {
  createCategory,
  deleteCategory,
  slugify,
  updateCategory,
} from "@/lib/categories-store";
import {
  bulkApprovePending,
  createListing,
  deleteListing,
  updateListingAdminNotes,
  updateListingStatus,
} from "@/lib/listings-store";
import { isValidTcKimlikNo } from "@/lib/auth/tc";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserByTcNo,
  updateUser,
} from "@/lib/users-store";
import { createCampaign, finishCampaign } from "@/lib/email/campaigns-store";
import { isEmailConfigured } from "@/lib/email/config";
import { sendBulkEmails, sendTransactionalEmail } from "@/lib/email/send";
import { htmlToPlainText } from "@/lib/email/template";
import {
  deleteSubscriber,
  getActiveRecipients,
  syncSubscribersFromSources,
  upsertSubscriber,
} from "@/lib/email/subscribers-store";

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@tekneshop.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email !== adminEmail || password !== adminPassword) {
    redirect("/admin/login?error=1");
  }

  const session = await getAdminSession();
  session.isLoggedIn = true;
  session.email = email;
  await session.save();
  redirect("/admin");
}

export async function adminLogoutAction() {
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}

export async function approveListingAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await updateListingStatus(id, "approved");
  await logActivity({
    action: "approve",
    entityType: "listing",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin");
  revalidatePath("/tekne");
  revalidatePath("/");
}

export async function rejectListingAction(id: number, reason: string) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await updateListingStatus(id, "rejected", { rejectionReason: reason });
  await logActivity({
    action: "reject",
    entityType: "listing",
    entityId: id,
    adminEmail: session.email,
    details: { reason },
  });
  revalidatePath("/admin");
}

export async function archiveListingAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await updateListingStatus(id, "archived");
  await logActivity({
    action: "archive",
    entityType: "listing",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin");
  revalidatePath("/tekne");
}

export async function deleteListingAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await deleteListing(id);
  await logActivity({
    action: "delete",
    entityType: "listing",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin");
  revalidatePath("/tekne");
}

export async function toggleFeaturedAction(id: number, featured: boolean) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await updateListingStatus(id, "approved", { isFeatured: featured });
  await logActivity({
    action: featured ? "feature" : "unfeature",
    entityType: "listing",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin");
  revalidatePath("/tekne");
}

export async function saveAdAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;

  const idRaw = formData.get("id");
  const schedule = parseAdScheduleFromForm(formData);
  await upsertAd({
    id: idRaw ? Number(idRaw) : undefined,
    placement: formData.get("placement") as AdPlacement,
    slot: formData.get("slot") ? Number(formData.get("slot")) : null,
    title: String(formData.get("title")),
    subtitle: String(formData.get("subtitle") || ""),
    imageUrl: String(formData.get("imageUrl") || "") || undefined,
    linkUrl: String(formData.get("linkUrl") || "/ilan-ver"),
    active: formData.get("active") === "on",
    priority: Number(formData.get("priority") || 0),
    startsAt: schedule.startsAt,
    endsAt: schedule.endsAt,
  });

  await logActivity({
    action: idRaw ? "update_ad" : "create_ad",
    entityType: "ad",
    adminEmail: session.email,
  });

  revalidatePath("/admin/reklamlar");
  revalidatePath("/");
}

export async function deleteAdAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await deleteAd(id);
  await logActivity({
    action: "delete_ad",
    entityType: "ad",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin/reklamlar");
}

export async function saveSettingsAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;

  const current = await getSiteConfig();
  const config: SiteConfig = {
    ...current,
    siteName: String(formData.get("siteName") || current.siteName),
    supportEmail: String(formData.get("supportEmail") || current.supportEmail),
    supportPhone: String(formData.get("supportPhone") || current.supportPhone),
    whatsappNumber: String(formData.get("whatsappNumber") || current.whatsappNumber),
    whatsappPrefillMessage: String(
      formData.get("whatsappPrefillMessage") || current.whatsappPrefillMessage,
    ),
    maintenanceMode: formData.get("maintenanceMode") === "on",
    maintenanceMessage: String(formData.get("maintenanceMessage") || current.maintenanceMessage),
    seoDescription: String(formData.get("seoDescription") || current.seoDescription),
    moderationRequired: formData.get("moderationRequired") === "on",
    maxPhotosPerListing: Number(formData.get("maxPhotosPerListing") || 12),
    listingPricing: {
      ...current.listingPricing,
      enabled: formData.get("pricingEnabled") === "on",
      freePeriod: formData.get("freePeriod") === "on",
      pricePerListing: Number(formData.get("pricePerListing") || 299),
      featuredListingPrice: Number(formData.get("featuredListingPrice") || 149),
    },
  };

  await saveSiteConfig(config);
  await logActivity({
    action: "update_settings",
    entityType: "settings",
    adminEmail: session.email,
  });
  revalidatePath("/admin/ayarlar");
  revalidatePath("/admin/odemeler");
}

export async function savePackagesPricingAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;

  const current = await getSiteConfig();
  let packages = current.listingPricing.packages;

  const packagesJson = String(formData.get("packagesJson") || "");
  if (packagesJson) {
    try {
      const parsed = JSON.parse(packagesJson) as { name: string; count: number; price: number }[];
      if (Array.isArray(parsed)) {
        packages = parsed
          .filter((p) => p.name?.trim())
          .map((p) => ({
            name: String(p.name).trim(),
            count: Math.max(1, Number(p.count) || 1),
            price: Math.max(0, Number(p.price) || 0),
          }));
      }
    } catch {
      // keep existing packages
    }
  }

  const config: SiteConfig = {
    ...current,
    listingPricing: {
      ...current.listingPricing,
      enabled: formData.get("pricingEnabled") === "on",
      freePeriod: formData.get("freePeriod") === "on",
      pricePerListing: Number(formData.get("pricePerListing") || current.listingPricing.pricePerListing),
      featuredListingPrice: Number(
        formData.get("featuredListingPrice") || current.listingPricing.featuredListingPrice,
      ),
      packages,
    },
  };

  await saveSiteConfig(config);
  await logActivity({
    action: "update_package_pricing",
    entityType: "settings",
    adminEmail: session.email,
    details: { packages: packages.length },
  });
  revalidatePath("/admin/odemeler");
  revalidatePath("/admin/ayarlar");
}

export async function submitListingFormAction(
  _prev: { ok: boolean; message: string; error: string },
  formData: FormData,
) {
  const result = await submitPublicListingAction(formData);
  if ("error" in result && result.error) {
    return { ok: false, message: "", error: result.error };
  }
  return { ok: true, message: result.message || "İlan gönderildi.", error: "" };
}

export async function submitPublicListingAction(formData: FormData) {
  const config = await getSiteConfig();
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Başlık zorunlu" };

  const slug = slugify(title) + "-" + Date.now().toString(36);
  const listingData = {
    slug,
    type: "boat" as const,
    title,
    description: String(formData.get("description") || ""),
    status: config.moderationRequired ? ("pending" as const) : ("approved" as const),
    condition: String(formData.get("condition") || "ikinci-el"),
    boatType: String(formData.get("boatType") || "motoryat"),
    price: Number(formData.get("price") || 0),
    year: Number(formData.get("year") || new Date().getFullYear()),
    lengthM: String(formData.get("lengthM") || ""),
    location: String(formData.get("location") || ""),
    engine: String(formData.get("engine") || ""),
    contactName: String(formData.get("contactName") || ""),
    contactEmail: String(formData.get("contactEmail") || ""),
    contactPhone: String(formData.get("contactPhone") || ""),
    image: "/boats/placeholder.jpg",
    feePaid: config.listingPricing.freePeriod || !config.listingPricing.enabled,
    feeAmount: config.listingPricing.enabled ? config.listingPricing.pricePerListing : 0,
    source: "user",
    approvedAt: config.moderationRequired ? null : new Date(),
  };

  if (!isDbConfigured()) {
    return {
      ok: true,
      message:
        "İlanınız alındı (demo). Canlı moderasyon için Neon veritabanı bağlantısı gerekiyor.",
    };
  }

  await createListing(listingData);

  const contactEmail = listingData.contactEmail.trim();
  if (contactEmail && formData.get("emailConsent") === "on") {
    await upsertSubscriber({
      email: contactEmail,
      name: listingData.contactName || undefined,
      source: "listing",
    });
  }

  revalidatePath("/admin/ilanlar");
  revalidatePath("/tekne");

  return {
    ok: true,
    message: config.moderationRequired
      ? "İlanınız incelenmek üzere gönderildi. Onaylandığında yayına alınacak."
      : "İlanınız yayına alındı.",
  };
}

export async function saveCategoryAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;

  const id = formData.get("id") ? Number(formData.get("id")) : undefined;
  const parentIdRaw = formData.get("parentId");
  const parentId = parentIdRaw ? Number(parentIdRaw) : null;
  const label = String(formData.get("label") || "").trim();
  if (!label) return;

  const payload = {
    label,
    slug: String(formData.get("slug") || slugify(label)),
    navType: (formData.get("navType") as "tekne" | "magaza" | "custom") || "magaza",
    href: String(formData.get("href") || "") || undefined,
    sortOrder: Number(formData.get("sortOrder") || 0),
    featured: formData.get("featured") === "on",
  };

  if (id) {
    await updateCategory(id, {
      label: payload.label,
      slug: payload.slug,
      href: payload.href ?? null,
      sortOrder: payload.sortOrder,
      featured: payload.featured,
      active: formData.get("active") !== "off",
    });
  } else {
    await createCategory({ ...payload, parentId });
  }

  await logActivity({
    action: id ? "update_category" : "create_category",
    entityType: "category",
    entityId: id,
    adminEmail: session.email,
    details: { label },
  });

  revalidatePath("/admin/kategoriler");
  revalidatePath("/");
  revalidatePath("/magaza");
}

export async function deleteCategoryAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await deleteCategory(id);
  await logActivity({
    action: "delete_category",
    entityType: "category",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin/kategoriler");
  revalidatePath("/");
}

export async function saveAccountingAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;

  const description = String(formData.get("description") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  if (!description || amount <= 0) return;

  await createAccountingEntry({
    type: formData.get("type") as AccountingType,
    category: (formData.get("category") as AccountingCategory) || "other",
    amount,
    description,
    reference: String(formData.get("reference") || "") || undefined,
    customerName: String(formData.get("customerName") || "") || undefined,
    customerEmail: String(formData.get("customerEmail") || "") || undefined,
    paymentMethod: String(formData.get("paymentMethod") || "") || undefined,
    status: (formData.get("status") as "pending" | "completed" | "cancelled") || "completed",
    entryDate: formData.get("entryDate")
      ? new Date(String(formData.get("entryDate")))
      : new Date(),
  });

  await logActivity({
    action: "create_accounting_entry",
    entityType: "accounting",
    adminEmail: session.email,
    details: { description, amount },
  });

  revalidatePath("/admin/muhasebe");
}

export async function updateAccountingStatusAction(
  id: number,
  status: "pending" | "completed" | "cancelled",
) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await updateAccountingStatus(id, status);
  await logActivity({
    action: "update_accounting_status",
    entityType: "accounting",
    entityId: id,
    adminEmail: session.email,
    details: { status },
  });
  revalidatePath("/admin/muhasebe");
}

export async function deleteAccountingAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await deleteAccountingEntry(id);
  await logActivity({
    action: "delete_accounting_entry",
    entityType: "accounting",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin/muhasebe");
}

export async function bulkApproveAction() {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  const approved = await bulkApprovePending();
  await logActivity({
    action: "bulk_approve",
    entityType: "listing",
    adminEmail: session.email,
    details: { count: approved.length },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/ilanlar");
  revalidatePath("/tekne");
}

export async function saveListingNoteAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  const id = Number(formData.get("id"));
  await updateListingAdminNotes(id, String(formData.get("adminNotes") || ""));
  await logActivity({
    action: "update_listing_note",
    entityType: "listing",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin/ilanlar");
}

export async function saveAnnouncementAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  const idRaw = formData.get("id");
  await upsertAnnouncement({
    id: idRaw ? Number(idRaw) : undefined,
    message: String(formData.get("message")),
    linkUrl: String(formData.get("linkUrl") || "") || undefined,
    linkLabel: String(formData.get("linkLabel") || "") || undefined,
    tone: String(formData.get("tone") || "info"),
    active: formData.get("active") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  });
  await logActivity({
    action: idRaw ? "update_announcement" : "create_announcement",
    entityType: "announcement",
    adminEmail: session.email,
  });
  revalidatePath("/admin/duyurular");
  revalidatePath("/");
}

export async function deleteAnnouncementAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await deleteAnnouncement(id);
  await logActivity({
    action: "delete_announcement",
    entityType: "announcement",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin/duyurular");
}

export async function submitContactAction(
  _prev: { ok: boolean; message: string; error: string },
  formData: FormData,
) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();
  if (!name || !email || !subject || !message) {
    return { ok: false, message: "", error: "Tüm zorunlu alanları doldurun." };
  }
  if (!isDbConfigured()) {
    return { ok: true, message: "Mesajınız alındı (demo mod).", error: "" };
  }
  await createContactMessage({
    name,
    email,
    phone: String(formData.get("phone") || "") || undefined,
    subject,
    message,
  });

  if (formData.get("emailConsent") === "on") {
    await upsertSubscriber({ email, name, source: "contact" });
  }

  return { ok: true, message: "Mesajınız iletildi. En kısa sürede dönüş yapılacak.", error: "" };
}

export async function markMessageReadAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await markMessageRead(id);
  revalidatePath("/admin/mesajlar");
}

export async function deleteMessageAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await deleteMessage(id);
  revalidatePath("/admin/mesajlar");
}

export async function syncEmailSubscribersAction() {
  const session = await requireAdmin();
  if (!isDbConfigured()) {
    return { error: "Veritabanı bağlı değil." };
  }
  const result = await syncSubscribersFromSources();
  await logActivity({
    action: "sync_subscribers",
    entityType: "email",
    adminEmail: session.email,
    details: result,
  });
  revalidatePath("/admin/eposta");
  return {
    message: `${result.added} yeni adres eklendi. Toplam aktif: ${result.total}.`,
  };
}

export async function sendTestEmailAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isEmailConfigured()) {
    return { error: "RESEND_API_KEY tanımlı değil." };
  }

  const config = await getSiteConfig();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!subject || !body) return { error: "Konu ve mesaj zorunlu." };

  const to = session.email || process.env.ADMIN_EMAIL || "admin@tekneshop.com";
  const result = await sendTransactionalEmail({
    to,
    subject: `[TEST] ${subject}`,
    body,
    siteName: config.siteName,
    supportEmail: config.supportEmail,
  });

  if (!result.ok) return { error: result.error };

  await logActivity({
    action: "send_test_email",
    entityType: "email",
    adminEmail: session.email,
    details: { to, subject },
  });

  return { message: `Test e-postası ${to} adresine gönderildi.` };
}

export async function sendEmailCampaignAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return { error: "Veritabanı bağlı değil." };
  if (!isEmailConfigured()) return { error: "RESEND_API_KEY tanımlı değil." };

  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!subject || !body) return { error: "Konu ve mesaj zorunlu." };

  const recipients = await getActiveRecipients();
  if (recipients.length === 0) return { error: "Aktif abone yok. Önce listeyi senkronize edin." };

  const config = await getSiteConfig();
  const campaign = await createCampaign({
    subject,
    bodyHtml: body,
    bodyText: htmlToPlainText(body),
    recipientCount: recipients.length,
    adminEmail: session.email,
  });

  const result = await sendBulkEmails(recipients, {
    subject,
    body,
    siteName: config.siteName,
    supportEmail: config.supportEmail,
  });

  if (campaign) {
    await finishCampaign(campaign.id, result);
  }

  await logActivity({
    action: "send_email_campaign",
    entityType: "email",
    entityId: campaign?.id,
    adminEmail: session.email,
    details: { subject, ...result },
  });

  revalidatePath("/admin/eposta");

  return {
    message: `Gönderim tamamlandı: ${result.sent} başarılı, ${result.failed} hata.`,
    error: result.errors.length ? result.errors.join("; ") : undefined,
  };
}

export async function deleteSubscriberAction(id: number) {
  await requireAdmin();
  if (!isDbConfigured()) return;
  await deleteSubscriber(id);
  revalidatePath("/admin/eposta");
}

export async function saveUserAction(formData: FormData) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;

  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const name = String(formData.get("name") || "").trim();
  const tcNo = String(formData.get("tcNo") || "").replace(/\s/g, "");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const active = formData.get("active") === "on";

  if (!name || !tcNo || !email) return;
  if (!isValidTcKimlikNo(tcNo)) return;

  if (await getUserByEmail(email, id ?? undefined)) return;
  if (await getUserByTcNo(tcNo, id ?? undefined)) return;

  if (id) {
    await updateUser(id, {
      name,
      email,
      phone,
      tcNo,
      password: password || undefined,
      active,
    });
    await logActivity({
      action: "update_user",
      entityType: "user",
      entityId: id,
      adminEmail: session.email,
      details: { name, email },
    });
  } else {
    if (!password || password.length < 6) return;
    await createUser({ name, email, phone, tcNo, password });
    await logActivity({
      action: "create_user",
      entityType: "user",
      adminEmail: session.email,
      details: { name, email },
    });
  }

  revalidatePath("/admin/kullanicilar");
}

export async function deleteUserAction(id: number) {
  const session = await requireAdmin();
  if (!isDbConfigured()) return;
  await deleteUser(id);
  await logActivity({
    action: "delete_user",
    entityType: "user",
    entityId: id,
    adminEmail: session.email,
  });
  revalidatePath("/admin/kullanicilar");
}
