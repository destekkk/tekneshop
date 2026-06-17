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
  { value: OTHER_VALUE, label: "Diğer" },
];

export const modelFormOptions = [
  { value: "flybridge", label: "Flybridge" },
  { value: "open", label: "Open / Sport" },
  { value: "cruiser", label: "Cruiser" },
  { value: "trawler", label: "Trawler" },
  { value: "sailing", label: "Yelkenli" },
  { value: "catamaran", label: "Katamaran" },
  { value: "rib", label: "RIB" },
  { value: "jet-ski", label: "Jet Ski / PWC" },
  { value: OTHER_VALUE, label: "Diğer" },
];

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
