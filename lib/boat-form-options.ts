import type { BoatType } from "@/lib/boats";

export const OTHER_VALUE = "diger";

export const boatTypeFormOptions: { value: BoatType | typeof OTHER_VALUE; label: string }[] = [
  { value: "motoryat", label: "Motoryat" },
  { value: "yelkenli", label: "Yelkenli" },
  { value: "katamaran", label: "Katamaran" },
  { value: "sisme-bot", label: "Şişme bot" },
  { value: "jet-ski", label: "Jet ski" },
  { value: OTHER_VALUE, label: "Diğer" },
];

export const brandFormOptions = [
  { value: "azimut", label: "Azimut" },
  { value: "beneteau", label: "Beneteau" },
  { value: "bavaria", label: "Bavaria" },
  { value: "princess", label: "Princess" },
  { value: "ferretti", label: "Ferretti" },
  { value: "jeanneau", label: "Jeanneau" },
  { value: "lagoon", label: "Lagoon" },
  { value: "quicksilver", label: "Quicksilver" },
  { value: "zodiac", label: "Zodiac" },
  { value: "sunseeker", label: "Sunseeker" },
  { value: "sea-ray", label: "Sea Ray" },
  { value: "prestige", label: "Prestige" },
  { value: "dufour", label: "Dufour" },
  { value: "fairline", label: "Fairline" },
  { value: "sea-doo", label: "Sea-Doo" },
  { value: "hanse", label: "Hanse" },
  { value: "saxdor", label: "Saxdor" },
  { value: OTHER_VALUE, label: "Diğer" },
];

export const modelFormOptions = [
  { value: "55-fly", label: "55 Fly" },
  { value: "oceanis-46", label: "Oceanis 46.1" },
  { value: "activ-675", label: "Activ 675 Weekend" },
  { value: "milpro-580", label: "Mil Pro 580" },
  { value: "gtx-170", label: "GTX 170" },
  { value: "lagoon-42", label: "Lagoon 42" },
  { value: "cruiser-37", label: "Cruiser 37" },
  { value: OTHER_VALUE, label: "Diğer" },
];

export function buildTextSuggestions(
  staticOptions: { value: string; label: string }[],
  fromDb: string[],
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  const add = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const key = trimmed.toLocaleLowerCase("tr-TR");
    if (seen.has(key)) return;
    seen.add(key);
    result.push(trimmed);
  };

  for (const option of staticOptions) {
    if (option.value === OTHER_VALUE) continue;
    add(option.label);
  }

  for (const stored of fromDb) {
    const byValue = staticOptions.find((o) => o.value === stored);
    add(byValue?.label || stored);
  }

  return result.sort((a, b) => a.localeCompare(b, "tr-TR"));
}

export function storedBrandModelText(
  stored: string | null | undefined,
  options: { value: string; label: string }[],
) {
  if (!stored) return "";
  const byValue = options.find((o) => o.value === stored);
  if (byValue) return byValue.label;
  return stored;
}

function resolveFreeTextField(
  formData: FormData,
  field: string,
  otherField: string,
  options: { value: string; label: string }[],
) {
  const raw = String(formData.get(field) || "").trim();
  if (!raw) return "";
  if (raw === OTHER_VALUE) {
    return String(formData.get(otherField) || "").trim();
  }
  const byValue = options.find((o) => o.value === raw);
  if (byValue) return byValue.label;
  return raw;
}

export function resolveBrandField(formData: FormData) {
  return resolveFreeTextField(formData, "brand", "brandOther", brandFormOptions);
}

export function resolveModelField(formData: FormData) {
  return resolveFreeTextField(formData, "model", "modelOther", modelFormOptions);
}

export const conditionFormOptions = [
  { value: "sifir", label: "Sıfır" },
  { value: "ikinci-el", label: "İkinci el" },
  { value: "kiralik", label: "Kiralık" },
  { value: OTHER_VALUE, label: "Diğer" },
];

export function resolveSelectWithOther(
  formData: FormData,
  field: string,
  otherField: string,
  options: { value: string; label: string }[],
) {
  const value = String(formData.get(field) || "").trim();
  if (value === OTHER_VALUE) {
    return String(formData.get(otherField) || "").trim() || "Diğer";
  }
  if (!value) return "";
  return options.find((o) => o.value === value)?.label || value;
}

export function resolveBoatTypeStorage(formData: FormData) {
  const value = String(formData.get("boatType") || "").trim();
  if (value === OTHER_VALUE) {
    return String(formData.get("boatTypeOther") || "").trim() || "diger";
  }
  return value || "motoryat";
}

export function resolveConditionStorage(formData: FormData) {
  const value = String(formData.get("condition") || "").trim();
  if (value === OTHER_VALUE) {
    return String(formData.get("conditionOther") || "").trim() || "diger";
  }
  return value || "ikinci-el";
}
