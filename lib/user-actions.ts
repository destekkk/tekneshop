"use server";

import { revalidatePath } from "next/cache";
import { isValidTcKimlikNo } from "@/lib/auth/tc";
import { isDbConfigured } from "@/lib/db";
import { upsertSubscriber } from "@/lib/email/subscribers-store";
import { createUser, getUserByEmail, getUserByTcNo } from "@/lib/users-store";

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
