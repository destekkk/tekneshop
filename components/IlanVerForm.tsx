"use client";

import { useActionState } from "react";
import { submitListingFormAction } from "@/lib/admin/actions";

const initial = { ok: false, message: "", error: "" };

export default function IlanVerForm() {
  const [state, action, pending] = useActionState(submitListingFormAction, initial);

  return (
    <form action={action} className="space-y-4 rounded-xl border border-border bg-card p-6">
      {state.message ? (
        <p className="rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{state.message}</p>
      ) : null}
      {state.error ? (
        <p className="rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}

      <div>
        <label className="text-sm font-medium">Başlık *</label>
        <input
          name="title"
          required
          placeholder="Örn. 2021 model motoryat"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Açıklama</label>
        <textarea
          name="description"
          rows={4}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Durum</label>
          <select name="condition" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm">
            <option value="sifir">Sıfır</option>
            <option value="ikinci-el">İkinci el</option>
            <option value="kiralik">Kiralık</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Tekne tipi</label>
          <select name="boatType" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm">
            <option value="motoryat">Motoryat</option>
            <option value="yelkenli">Yelkenli</option>
            <option value="sisme-bot">Şişme bot</option>
            <option value="jet-ski">Jet ski</option>
            <option value="katamaran">Katamaran</option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Fiyat (₺)</label>
          <input name="price" type="number" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Yıl</label>
          <input name="year" type="number" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Boy (m)</label>
          <input name="lengthM" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Konum</label>
          <input name="location" placeholder="İstanbul, Tuzla" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Motor</label>
        <input name="engine" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-sm font-medium">Ad Soyad</label>
          <input name="contactName" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Telefon</label>
          <input name="contactPhone" type="tel" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">E-posta</label>
          <input name="contactEmail" type="email" className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" />
        </div>
      </div>
      <fieldset className="space-y-2 rounded-lg border border-border bg-[#fafafa] p-4">
        <legend className="px-1 text-sm font-medium">İletişim tercihi</legend>
        <label className="flex cursor-pointer items-start gap-2 text-[13px]">
          <input type="radio" name="showContactPhone" value="yes" className="mt-1" />
          <span>
            <strong>Telefonum ilanda görünsün</strong>
            <span className="block text-[12px] text-muted">Ziyaretçiler numaranızı doğrudan görebilir.</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-[13px]">
          <input type="radio" name="showContactPhone" value="no" defaultChecked className="mt-1" />
          <span>
            <strong>Telefonumu gizle, mesajla ulaşılsın</strong>
            <span className="block text-[12px] text-muted">
              Numaranız gizli kalır; ilgilenenler mesaj formu ile ulaşır.
            </span>
          </span>
        </label>
      </fieldset>
      <label className="flex items-start gap-2 text-[12px] text-muted">
        <input name="emailConsent" type="checkbox" className="mt-0.5" />
        TekneShop duyuru ve kampanya e-postaları almak istiyorum (isteğe bağlı)
      </label>
      <p className="text-[12px] text-muted">
        Şu an ilan verme ücretsizdir. İlanınız admin onayından sonra yayına alınır.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="btn-cta w-full rounded-sm py-3 text-sm font-bold disabled:opacity-50"
      >
        {pending ? "Gönderiliyor…" : "İlanı gönder"}
      </button>
    </form>
  );
}
