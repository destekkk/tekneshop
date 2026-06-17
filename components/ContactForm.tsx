"use client";

import { fieldValue, isFieldChecked, preserveFormKey } from "@/lib/form-preserve";
import { usePreserveFormAction } from "@/lib/use-preserve-form-action";
import { submitContactAction } from "@/lib/admin/actions";

const initial = { ok: false, message: "", error: "" };

export default function ContactForm() {
  const { state, action, pending, values } = usePreserveFormAction(submitContactAction, initial);
  const formKey = preserveFormKey(state, values);

  return (
    <form
      key={formKey}
      action={action}
      className="space-y-4 rounded-xl border border-border bg-card p-6"
    >
      {state.message ? (
        <p className="rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{state.message}</p>
      ) : null}
      {state.error ? (
        <p className="rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Ad Soyad *</label>
          <input
            name="name"
            required
            defaultValue={fieldValue(values, "name")}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">E-posta *</label>
          <input
            name="email"
            type="email"
            required
            defaultValue={fieldValue(values, "email")}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Telefon</label>
        <input
          name="phone"
          defaultValue={fieldValue(values, "phone")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Konu *</label>
        <input
          name="subject"
          required
          defaultValue={fieldValue(values, "subject")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Mesaj *</label>
        <textarea
          name="message"
          required
          rows={5}
          defaultValue={fieldValue(values, "message")}
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
      <button type="submit" disabled={pending} className="btn-cta rounded-sm px-5 py-2.5 text-sm font-bold disabled:opacity-50">
        Gönder
      </button>
    </form>
  );
}
