"use client";

import { useState } from "react";
import type { FormFieldValues } from "@/lib/form-preserve";
import { fieldValue } from "@/lib/form-preserve";
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
  initialSelected = "",
  initialOther = "",
}: {
  label: string;
  name: string;
  otherName: string;
  options: { value: string; label: string }[];
  required?: boolean;
  initialSelected?: string;
  initialOther?: string;
}) {
  const [selected, setSelected] = useState(initialSelected);

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
          defaultValue={initialOther}
          className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      ) : null}
    </div>
  );
}

export default function BoatListingFields({ initialValues = {} }: { initialValues?: FormFieldValues }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectWithOther
          label="Durum"
          name="condition"
          otherName="conditionOther"
          options={conditionFormOptions}
          initialSelected={fieldValue(initialValues, "condition")}
          initialOther={fieldValue(initialValues, "conditionOther")}
        />
        <SelectWithOther
          label="Tekne tipi *"
          name="boatType"
          otherName="boatTypeOther"
          options={boatTypeFormOptions}
          required
          initialSelected={fieldValue(initialValues, "boatType")}
          initialOther={fieldValue(initialValues, "boatTypeOther")}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectWithOther
          label="Marka"
          name="brand"
          otherName="brandOther"
          options={brandFormOptions}
          initialSelected={fieldValue(initialValues, "brand")}
          initialOther={fieldValue(initialValues, "brandOther")}
        />
        <SelectWithOther
          label="Model"
          name="model"
          otherName="modelOther"
          options={modelFormOptions}
          initialSelected={fieldValue(initialValues, "model")}
          initialOther={fieldValue(initialValues, "modelOther")}
        />
      </div>
    </div>
  );
}
