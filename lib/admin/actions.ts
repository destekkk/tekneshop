"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/admin/activity";
import { getSiteConfig, saveSiteConfig, type SiteConfig } from "@/lib/admin/settings";
import { getAdminSession, requireAdmin } from "@/lib/admin/session";
import { deleteAd, upsertAd, type AdPlacement } from "@/lib/ads-store";
import { isDbConfigured } from "@/lib/db";
import {
  createListing,
  deleteListing,
  slugify,
  updateListingStatus,
} from "@/lib/listings-store";

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
  revalidatePath("/admin/ilanlar/bekleyen");
  revalidatePath("/tekne");

  return {
    ok: true,
    message: config.moderationRequired
      ? "İlanınız incelenmek üzere gönderildi. Onaylandığında yayına alınacak."
      : "İlanınız yayına alındı.",
  };
}
