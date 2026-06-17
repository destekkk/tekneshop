"use client";

import Link from "next/link";
import { fieldValue, isFieldChecked, preserveFormKey } from "@/lib/form-preserve";
import { usePreserveFormAction } from "@/lib/use-preserve-form-action";
import { registerUserAction } from "@/lib/user-actions";

const initial = { ok: false, message: "", error: "" };

export default function RegisterForm({ embedded = false }: { embedded?: boolean }) {
  const { state, action, pending, values } = usePreserveFormAction(registerUserAction, initial);
  const formKey = preserveFormKey(state, values);

  return (
    <form
      key={formKey}
      action={action}
      className={`space-y-4 p-6 ${embedded ? "" : "rounded-xl border border-border bg-card"}`}
    >
      {state.message ? (
        <p className="rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{state.message}</p>
      ) : null}
      {state.error ? (
        <p className="rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}

      <div>
        <label className="text-sm font-medium">Ad Soyad *</label>
        <input
          name="name"
          required
          autoComplete="name"
          defaultValue={fieldValue(values, "name")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">TC Kimlik No *</label>
        <input
          name="tcNo"
          required
          inputMode="numeric"
          maxLength={11}
          pattern="\d{11}"
          placeholder="11 haneli TC kimlik numarası"
          autoComplete="off"
          defaultValue={fieldValue(values, "tcNo")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm tracking-wider"
        />
        <p className="mt-1 text-[11px] text-muted">Sadece rakam, 11 hane.</p>
      </div>

      <div>
        <label className="text-sm font-medium">E-posta *</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue={fieldValue(values, "email")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Telefon</label>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="05xx xxx xx xx"
          autoComplete="tel"
          defaultValue={fieldValue(values, "phone")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Şifre *</label>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          defaultValue={fieldValue(values, "password")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Şifre Tekrar *</label>
        <input
          name="passwordConfirm"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          defaultValue={fieldValue(values, "passwordConfirm")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-start gap-2 text-[12px] text-muted">
        <input
          name="emailConsent"
          type="checkbox"
          defaultChecked={isFieldChecked(values, "emailConsent")}
          className="mt-0.5"
        />
        Kampanya ve duyuru e-postaları almak istiyorum (isteğe bağlı)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="btn-cta w-full rounded-sm py-3 text-sm font-bold disabled:opacity-50"
      >
        {pending ? "Kaydediliyor…" : "Kayıt Ol"}
      </button>

      {!embedded ? (
        <p className="text-center text-[12px] text-muted">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="text-navy hover:underline">
            Giriş yapın
          </Link>
        </p>
      ) : null}
    </form>
  );
}
