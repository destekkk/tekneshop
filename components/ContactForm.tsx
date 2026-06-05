"use client";

import { useActionState } from "react";
import { submitContactAction } from "@/lib/admin/actions";

const initial = { ok: false, message: "", error: "" };

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContactAction, initial);

  return (
    <form action={action} className="space-y-4 rounded-xl border border-border bg-card p-6">
      {state.message ? (
        <p className="rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{state.message}</p>
      ) : null}
      {state.error ? (
        <p className="rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Ad Soyad *</label>
          <input name="name" required className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">E-posta *</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Telefon</label>
        <input name="phone" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">Konu *</label>
        <input name="subject" required className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">Mesaj *</label>
        <textarea name="message" required rows={5} className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
      </div>
      <label className="flex items-start gap-2 text-[12px] text-muted">
        <input name="emailConsent" type="checkbox" className="mt-0.5" />
        Kampanya ve duyuru e-postaları almak istiyorum (isteğe bağlı)
      </label>
      <button type="submit" disabled={pending} className="btn-cta rounded-sm px-5 py-2.5 text-sm font-bold disabled:opacity-50">
        Gönder
      </button>
    </form>
  );
}
