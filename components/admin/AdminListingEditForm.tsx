"use client";

import { useActionState, useState } from "react";
import ListingImageUpload from "@/components/ListingImageUpload";
import { updateListingAction } from "@/lib/admin/actions";
import { fieldValue, preserveFormKey } from "@/lib/form-preserve";
import {
  boatTypeFormOptions,
  brandFormOptions,
  conditionFormOptions,
  modelFormOptions,
  OTHER_VALUE,
} from "@/lib/boat-form-options";
import type { Listing } from "@/lib/db/schema";
import {
  listingCurrencyOptions,
  parseListingCurrency,
} from "@/lib/listing-currency";

const initial = { ok: false, message: "", error: "" };
const DEFAULT_YEAR = 2026;
const YEAR_MIN = 1970;
const yearOptions = Array.from({ length: DEFAULT_YEAR - YEAR_MIN + 1 }, (_, i) => DEFAULT_YEAR - i);

function storedToSelect(
  stored: string | null | undefined,
  options: { value: string; label: string }[],
) {
  if (!stored) return "";
  if (options.some((o) => o.value === stored)) return stored;
  if (options.some((o) => o.label === stored)) {
    return options.find((o) => o.label === stored)!.value;
  }
  return OTHER_VALUE;
}

function storedOtherText(
  stored: string | null | undefined,
  options: { value: string; label: string }[],
) {
  if (!stored) return "";
  if (options.some((o) => o.value === stored || o.label === stored)) return "";
  return stored;
}

const fieldClass = "mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm";

export default function AdminListingEditForm({ listing }: { listing: Listing }) {
  const [state, dispatch, pending] = useActionState(updateListingAction, initial);
  const [values, setValues] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const formKey = preserveFormKey(state, values);

  const v = (name: string, fallback: string) => fieldValue(values, name, fallback);

  const [condition, setCondition] = useState(() =>
    storedToSelect(listing.condition, conditionFormOptions),
  );
  const [boatType, setBoatType] = useState(() =>
    storedToSelect(listing.boatType, boatTypeFormOptions),
  );
  const [brand, setBrand] = useState(() => storedToSelect(listing.brand, brandFormOptions));
  const [model, setModel] = useState(() => storedToSelect(listing.model, modelFormOptions));

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

  return (
    <form key={formKey} action={handleSubmit} className="space-y-4 rounded-lg border border-border bg-white p-4">
      <h2 className="text-sm font-bold text-navy">Düzenle</h2>

      {state.message ? (
        <p className="rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{state.message}</p>
      ) : null}
      {state.error ? (
        <p className="rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}

      <input type="hidden" name="id" value={listing.id} />

      <div>
        <label className="text-sm font-medium">Başlık *</label>
        <input name="title" required defaultValue={v("title", listing.title)} className={fieldClass} />
      </div>

      <div>
        <label className="text-sm font-medium">Açıklama</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={v("description", listing.description || "")}
          className={fieldClass}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Durum</label>
          <select
            name="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className={fieldClass}
          >
            <option value="">Seçin</option>
            {conditionFormOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {condition === OTHER_VALUE ? (
            <input
              name="conditionOther"
              defaultValue={v(
                "conditionOther",
                storedOtherText(listing.condition, conditionFormOptions),
              )}
              placeholder="Lütfen belirtin"
              className={`${fieldClass} mt-2`}
            />
          ) : null}
        </div>
        <div>
          <label className="text-sm font-medium">Tekne tipi *</label>
          <select
            name="boatType"
            required
            value={boatType}
            onChange={(e) => setBoatType(e.target.value)}
            className={fieldClass}
          >
            <option value="">Seçin</option>
            {boatTypeFormOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {boatType === OTHER_VALUE ? (
            <input
              name="boatTypeOther"
              defaultValue={v(
                "boatTypeOther",
                storedOtherText(listing.boatType, boatTypeFormOptions),
              )}
              placeholder="Lütfen belirtin"
              className={`${fieldClass} mt-2`}
            />
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Marka</label>
          <select
            name="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={fieldClass}
          >
            <option value="">Seçin</option>
            {brandFormOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {brand === OTHER_VALUE ? (
            <input
              name="brandOther"
              defaultValue={v("brandOther", storedOtherText(listing.brand, brandFormOptions))}
              placeholder="Lütfen belirtin"
              className={`${fieldClass} mt-2`}
            />
          ) : null}
        </div>
        <div>
          <label className="text-sm font-medium">Model</label>
          <select
            name="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={fieldClass}
          >
            <option value="">Seçin</option>
            {modelFormOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {model === OTHER_VALUE ? (
            <input
              name="modelOther"
              defaultValue={v("modelOther", storedOtherText(listing.model, modelFormOptions))}
              placeholder="Lütfen belirtin"
              className={`${fieldClass} mt-2`}
            />
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Fiyat *</label>
          <div className="mt-1 flex gap-2">
            <input
              name="price"
              type="number"
              required
              min={1}
              defaultValue={v("price", String(listing.price))}
              className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm"
            />
            <select
              name="currency"
              defaultValue={v("currency", parseListingCurrency(listing.currency))}
              className="w-[108px] rounded-lg border border-border bg-white px-2 py-2 text-sm"
            >
              {listingCurrencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Yıl</label>
          <select
            name="year"
            defaultValue={v("year", String(listing.year || DEFAULT_YEAR))}
            className={fieldClass}
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
          <input name="lengthM" defaultValue={v("lengthM", listing.lengthM || "")} className={fieldClass} />
        </div>
        <div>
          <label className="text-sm font-medium">Konum</label>
          <input name="location" defaultValue={v("location", listing.location || "")} className={fieldClass} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Motor</label>
        <input name="engine" defaultValue={v("engine", listing.engine || "")} className={fieldClass} />
      </div>

      <div>
        <p className="text-sm font-medium">Fotoğraflar</p>
        <p className="mt-1 text-[12px] text-muted">
          Yeni fotoğraf seçerseniz mevcut görsellerin tamamı yenileriyle değiştirilir.
        </p>
        <div className="mt-2">
          <ListingImageUpload onFilesChange={setImageFiles} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Ad Soyad</label>
          <input
            name="contactName"
            defaultValue={v("contactName", listing.contactName || "")}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Telefon</label>
          <input
            name="contactPhone"
            type="tel"
            defaultValue={v("contactPhone", listing.contactPhone || "")}
            className={fieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">E-posta</label>
          <input
            name="contactEmail"
            type="email"
            defaultValue={v("contactEmail", listing.contactEmail || "")}
            className={fieldClass}
          />
        </div>
      </div>

      <fieldset className="space-y-2 rounded-lg border border-border bg-[#fafafa] p-4">
        <legend className="px-1 text-sm font-medium">İletişim tercihi</legend>
        <label className="flex cursor-pointer items-start gap-2 text-[13px]">
          <input
            type="radio"
            name="showContactPhone"
            value="yes"
            defaultChecked={
              values.showContactPhone ? values.showContactPhone === "yes" : listing.showContactPhone
            }
            className="mt-1"
          />
          <span>Telefon ilanda görünsün</span>
        </label>
        <label className="flex cursor-pointer items-start gap-2 text-[13px]">
          <input
            type="radio"
            name="showContactPhone"
            value="no"
            defaultChecked={
              values.showContactPhone ? values.showContactPhone === "no" : !listing.showContactPhone
            }
            className="mt-1"
          />
          <span>Telefon gizli, mesajla ulaşılsın</span>
        </label>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="btn-cta w-full rounded-sm py-3 text-sm font-bold disabled:opacity-50"
      >
        {pending ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
      </button>
    </form>
  );
}
