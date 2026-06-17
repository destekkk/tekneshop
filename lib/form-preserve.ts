export type FormFieldValues = Record<string, string>;

export function snapshotFormData(formData: FormData): FormFieldValues {
  const values: FormFieldValues = {};
  formData.forEach((value, key) => {
    if (value instanceof File) return;
    values[key] = String(value);
  });
  return values;
}

export function fieldValue(values: FormFieldValues, name: string, fallback = "") {
  return values[name] ?? fallback;
}

export function isFieldChecked(values: FormFieldValues, name: string) {
  const v = values[name];
  return v === "on" || v === "yes" || v === "true";
}

export function preserveFormKey(state: { error?: string }, values: FormFieldValues) {
  if (state.error && Object.keys(values).length > 0) {
    return `preserve-${JSON.stringify(values)}`;
  }
  return "default";
}
