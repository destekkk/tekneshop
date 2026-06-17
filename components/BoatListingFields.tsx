"use client";

import { useState } from "react";
import {
  boatTypeFormOptions,
  brandFormOptions,
  conditionFormOptions,
  modelFormOptions,
  OTHER_VALUE,
} from "@/lib/boat-form-options";

function SelectWithOther({
  label,
  name,
  otherName,
  options,
  required,
}: {
  label: string;
  name: string;
  otherName: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  const [selected, setSelected] = useState("");

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        name={name}
        required={required}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
      >
        <option value="">Seçin</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {selected === OTHER_VALUE ? (
        <input
          name={otherName}
          required
          placeholder="Lütfen belirtin"
          className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      ) : null}
    </div>
  );
}

export default function BoatListingFields() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectWithOther
          label="Durum"
          name="condition"
          otherName="conditionOther"
          options={conditionFormOptions}
        />
        <SelectWithOther
          label="Tekne tipi *"
          name="boatType"
          otherName="boatTypeOther"
          options={boatTypeFormOptions}
          required
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectWithOther label="Marka" name="brand" otherName="brandOther" options={brandFormOptions} />
        <SelectWithOther label="Model" name="model" otherName="modelOther" options={modelFormOptions} />
      </div>
    </div>
  );
}
