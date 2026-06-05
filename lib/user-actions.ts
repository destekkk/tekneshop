"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidTcKimlikNo } from "@/lib/auth/tc";
import { getUserSession } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { upsertSubscriber } from "@/lib/email/subscribers-store";
import { createListingInquiry } from "@/lib/listing-inquiries-store";
import { createOffer, getUserOfferForListing } from "@/lib/offers-store";
import { getListingBySlug } from "@/lib/listings-store";
import {
  createUser,
  getUserByEmail,
  getUserByTcNo,
  verifyUserPassword,
} from "@/lib/users-store";

export async function loginUserAction(
  _prev: { ok: boolean; message: string; error: string },
  formData: FormData,
) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirect") || "/");

  if (!email || !password) {
    return { ok: false, message: "", error: "E-posta ve şifre girin." };
  }

  if (!isDbConfigured()) {
    return { ok: false, message: "", error: "Giriş için veritabanı bağlantısı gerekli." };
  }

  const user = await getUserByEmail(email);
  if (!user || !user.active) {
    return { ok: false, message: "", error: "E-posta veya şifre hatalı." };
  }

  const valid = await verifyUserPassword(password, user.passwordHash);
  if (!valid) {
    return { ok: false, message: "", error: "E-posta veya şifre hatalı." };
  }

  const session = await getUserSession();
  session.isLoggedIn = true;
  session.userId = user.id;
  session.email = user.email;
  session.name = user.name;
  await session.save();

  const safeRedirect = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  redirect(safeRedirect);
}

export async function logoutUserAction() {
  const session = await getUserSession();
  session.destroy();
  redirect("/");
}

export async function submitOfferAction(
  _prev: { ok: boolean; message: string; error: string },
  formData: FormData,
) {
  const listingId = Number(formData.get("listingId"));
  const amountRaw = String(formData.get("amount") || "").replace(/\./g, "").replace(/,/g, "");
  const amount = Number(amountRaw);
  const message = String(formData.get("message") || "").trim();
  const listingSlug = String(formData.get("listingSlug") || "");

  const session = await getUserSession();
  if (!session.isLoggedIn || !session.userId) {
    const dest = listingSlug
      ? `/giris?redirect=${encodeURIComponent(`/tekne/ilan/${listingSlug}`)}`
      : "/giris";
    redirect(dest);
  }

  if (!listingId || !Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "", error: "Geçerli bir teklif tutarı girin." };
  }

  if (!isDbConfigured()) {
    return { ok: false, message: "", error: "Teklif gönderimi için veritabanı gerekli." };
  }

  const listing = await getListingBySlug(listingSlug);
  if (!listing || listing.id !== listingId || listing.status !== "approved") {
    return { ok: false, message: "", error: "Bu ilan için teklif verilemiyor." };
  }

  const existing = await getUserOfferForListing(session.userId, listingId);
  if (existing && existing.status === "pending") {
    return { ok: false, message: "", error: "Bu ilan için zaten bekleyen bir teklifiniz var." };
  }

  await createOffer({
    listingId,
    userId: session.userId,
    amount,
    message: message || undefined,
  });

  revalidatePath(`/tekne/ilan/${listingSlug}`);
  revalidatePath("/admin/teklifler");

  return {
    ok: true,
    message: "Teklifiniz iletildi. Satıcı veya yönetici inceleyecektir.",
    error: "",
  };
}

export async function submitListingInquiryAction(
  _prev: { ok: boolean; message: string; error: string },
  formData: FormData,
) {
  const listingId = Number(formData.get("listingId"));
  const listingSlug = String(formData.get("listingSlug") || "");
  const listingTitle = String(formData.get("listingTitle") || "");
  const message = String(formData.get("message") || "").trim();

  const session = await getUserSession();
  const senderName = session.isLoggedIn
    ? session.name
    : String(formData.get("senderName") || "").trim();
  const senderEmail = session.isLoggedIn
    ? session.email
    : String(formData.get("senderEmail") || "").trim().toLowerCase();
  const senderPhone = String(formData.get("senderPhone") || "").trim();

  if (!listingId || !message) {
    return { ok: false, message: "", error: "Mesajınızı yazın." };
  }
  if (!senderName || !senderEmail) {
    return { ok: false, message: "", error: "Ad ve e-posta zorunludur." };
  }

  if (!isDbConfigured()) {
    return { ok: false, message: "", error: "Mesaj gönderimi için veritabanı gerekli." };
  }

  const listing = await getListingBySlug(listingSlug);
  if (!listing || listing.id !== listingId || listing.status !== "approved") {
    return { ok: false, message: "", error: "Bu ilan için mesaj gönderilemiyor." };
  }
  if (listing.showContactPhone) {
    return { ok: false, message: "", error: "Bu ilan doğrudan telefon ile iletişime açık." };
  }

  await createListingInquiry({
    listingId,
    listingTitle: listingTitle || listing.title,
    senderUserId: session.isLoggedIn ? session.userId : undefined,
    senderName,
    senderEmail,
    senderPhone: senderPhone || undefined,
    message,
  });

  revalidatePath(`/tekne/ilan/${listingSlug}`);
  revalidatePath("/admin/mesajlar");

  return {
    ok: true,
    message: "Mesajınız iletildi. İlan veren sizinle iletişime geçebilir.",
    error: "",
  };
}

export async function registerUserAction(
  _prev: { ok: boolean; message: string; error: string },
  formData: FormData,
) {
  const name = String(formData.get("name") || "").trim();
  const tcNo = String(formData.get("tcNo") || "").replace(/\s/g, "");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const passwordConfirm = String(formData.get("passwordConfirm") || "");

  if (!name || !tcNo || !email || !password) {
    return { ok: false, message: "", error: "Zorunlu alanları doldurun." };
  }

  if (!isValidTcKimlikNo(tcNo)) {
    return { ok: false, message: "", error: "Geçerli bir TC Kimlik No girin." };
  }

  if (password.length < 6) {
    return { ok: false, message: "", error: "Şifre en az 6 karakter olmalı." };
  }

  if (password !== passwordConfirm) {
    return { ok: false, message: "", error: "Şifreler eşleşmiyor." };
  }

  if (!isDbConfigured()) {
    return {
      ok: true,
      message: "Kayıt alındı (demo mod). Canlı kayıt için veritabanı bağlantısı gerekli.",
      error: "",
    };
  }

  if (await getUserByEmail(email, undefined)) {
    return { ok: false, message: "", error: "Bu e-posta adresi zaten kayıtlı." };
  }

  if (await getUserByTcNo(tcNo, undefined)) {
    return { ok: false, message: "", error: "Bu TC Kimlik No ile kayıt mevcut." };
  }

  await createUser({ name, email, phone, tcNo, password });

  if (formData.get("emailConsent") === "on") {
    await upsertSubscriber({ email, name, source: "manual" });
  }

  revalidatePath("/admin/kullanicilar");

  return {
    ok: true,
    message: "Kayıt başarılı. Giriş yapabilirsiniz.",
    error: "",
  };
}
