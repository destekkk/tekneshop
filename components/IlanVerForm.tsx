"use client";

import { useActionState, useEffect, useState } from "react";
import ListingImageUpload from "@/components/ListingImageUpload";
import BoatListingFields from "@/components/BoatListingFields";
import { fieldValue, isFieldChecked, preserveFormKey } from "@/lib/form-preserve";
import { submitListingFormAction } from "@/lib/admin/actions";

const initial = { ok: false, message: "", error: "" };

const DEFAULT_YEAR = 2026;
const YEAR_MIN = 1970;
const yearOptions = Array.from({ length: DEFAULT_YEAR - YEAR_MIN + 1 }, (_, i) => DEFAULT_YEAR - i);

export default function IlanVerForm({
  user,
  brandSuggestionsFromDb = [],
  modelSuggestionsFromDb = [],
}: {
  user: { name: string; email: string; phone?: string | null };
  brandSuggestionsFromDb?: string[];
  modelSuggestionsFromDb?: string[];
}) {
  const [state, dispatch, pending] = useActionState(submitListingFormAction, initial);
  const [values, setValues] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [successNonce, setSuccessNonce] = useState(0);
  const formKey = preserveFormKey(state, values, successNonce);
  const fields = state.ok ? {} : values;

  useEffect(() => {
    if (!state.ok) return;
    setValues({});
    setImageFiles([]);
    setSuccessNonce((n) => n + 1);
  }, [state.ok, state.message]);

  function handleSubmit(formData: FormData) {
    const snapshot: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) return;
      snapshot[key] = String(value);
    });
    setValues(snapshot);
    formData.delete("images");
    for (const file of imageFiles) {
      formData.append("images", file);
    }
    dispatch(formData);
  }

  const yearValue = fieldValue(fields, "year", String(DEFAULT_YEAR));
  const currencyValue = fieldValue(fields, "currency", "TRY");
  const showPhoneYes = fields.showContactPhone ? fields.showContactPhone === "yes" : false;
  const showPhoneNo = fields.showContactPhone ? fields.showContactPhone === "no" : true;

  return (
    <div className="space-y-4">
      {state.ok && state.message ? (
        <div
          className="rounded-lg border-2 border-emerald-400 bg-emerald-50 px-4 py-4 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <p className="text-[16px] font-bold text-emerald-900">
            {state.message.includes("yayına alındı")
              ? "İlanınız yayına alındı"
              : "İlanınız onaya gönderildi"}
          </p>
          <p className="mt-1 text-[13px] text-emerald-800">{state.message}</p>
        </div>
      ) : null}

      <form
        key={formKey}
        action={handleSubmit}
        className="space-y-4 rounded-xl border border-border bg-card p-6"
      >
      {state.error ? (
        <p className="rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}

      <div>
        <label className="text-sm font-medium">Başlık *</label>
        <input
          name="title"
          required
          placeholder="Örn. 2021 model motoryat"
          defaultValue={fieldValue(fields, "title")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Açıklama</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={fieldValue(fields, "description")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <BoatListingFields
        initialValues={fields}
        brandSuggestionsFromDb={brandSuggestionsFromDb}
        modelSuggestionsFromDb={modelSuggestionsFromDb}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Fiyat *</label>
          <div className="mt-1 flex gap-2">
            <input
              name="price"
              type="number"
              required
              min={1}
              placeholder="Örn. 1500000"
              defaultValue={fieldValue(fields, "price")}
              className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm"
            />
            <select
              name="currency"
              defaultValue={currencyValue}
              className="w-[108px] rounded-lg border border-border bg-white px-2 py-2 text-sm"
            >
              <option value="TRY">₺ TL</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Yıl</label>
          <select
            name="year"
            defaultValue={yearValue}
            className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Boy (m)</label>
          <input
            name="lengthM"
            defaultValue={fieldValue(fields, "lengthM")}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Konum</label>
          <input
            name="location"
            placeholder="İstanbul, Tuzla"
            defaultValue={fieldValue(fields, "location")}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Motor</label>
        <input
          name="engine"
          defaultValue={fieldValue(fields, "engine")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <ListingImageUpload key={`upload-${formKey}`} onFilesChange={setImageFiles} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Ad Soyad</label>
          <input
            name="contactName"
            defaultValue={fieldValue(fields, "contactName", user.name)}
            readOnly
            className="mt-1 w-full rounded-lg border border-border bg-[#fafafa] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Telefon</label>
          <input
            name="contactPhone"
            type="tel"
            defaultValue={fieldValue(fields, "contactPhone", user.phone || "")}
            placeholder="05xx xxx xx xx"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">E-posta</label>
          <input
            name="contactEmail"
            type="email"
            defaultValue={fieldValue(fields, "contactEmail", user.email)}
            readOnly
            className="mt-1 w-full rounded-lg border border-border bg-[#fafafa] px-3 py-2 text-sm"
          />
          <p className="mt-1 text-[11px] text-muted">Hesabınıza kayıtlı e-posta kullanılır.</p>
        </div>
      </div>
      <fieldset className="space-y-2 rounded-lg border border-border bg-[#fafafa] p-4">
        <legend className="px-1 text-sm font-medium">İletişim tercihi</legend>
        <label className="flex cursor-pointer items-start gap-2 text-[13px]">
          <input
            type="radio"
            name="showContactPhone"
            value="yes"
            defaultChecked={showPhoneYes}
            className="mt-1"
          />
          <span>
            <strong>Telefonum ilanda görünsün</strong>
            <span className="block text-[12px] text-muted">Ziyaretçiler numaranızı doğrudan görebilir.</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-[13px]">
          <input
            type="radio"
            name="showContactPhone"
            value="no"
            defaultChecked={showPhoneNo}
            className="mt-1"
          />
          <span>
            <strong>Telefonumu gizle, mesajla ulaşılsın</strong>
            <span className="block text-[12px] text-muted">
              Numaranız gizli kalır; ilgilenenler mesaj formu ile ulaşır.
            </span>
          </span>
        </label>
      </fieldset>
      <label className="flex items-start gap-2 text-[12px] text-muted">
        <input
          name="emailConsent"
          type="checkbox"
          defaultChecked={isFieldChecked(fields, "emailConsent")}
          className="mt-0.5"
        />
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
    </div>
  );
}
