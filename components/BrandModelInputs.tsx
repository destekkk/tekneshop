type Props = {
  brandSuggestions: string[];
  modelSuggestions: string[];
  brandValue?: string;
  modelValue?: string;
  fieldClass?: string;
};

const defaultFieldClass = "mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm";

function TextWithSuggestions({
  label,
  name,
  listId,
  suggestions,
  placeholder,
  defaultValue,
  fieldClass,
}: {
  label: string;
  name: string;
  listId: string;
  suggestions: string[];
  placeholder: string;
  defaultValue?: string;
  fieldClass: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        list={listId}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={fieldClass}
      />
      <datalist id={listId}>
        {suggestions.map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>
      <p className="mt-1 text-[11px] text-muted">Listede yoksa doğrudan yazın.</p>
    </div>
  );
}

export default function BrandModelInputs({
  brandSuggestions,
  modelSuggestions,
  brandValue = "",
  modelValue = "",
  fieldClass = defaultFieldClass,
}: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextWithSuggestions
        label="Marka"
        name="brand"
        listId="brand-suggestions"
        suggestions={brandSuggestions}
        placeholder="Örn. Azimut, Beneteau"
        defaultValue={brandValue}
        fieldClass={fieldClass}
      />
      <TextWithSuggestions
        label="Model"
        name="model"
        listId="model-suggestions"
        suggestions={modelSuggestions}
        placeholder="Örn. 55 Fly, Oceanis 46.1"
        defaultValue={modelValue}
        fieldClass={fieldClass}
      />
    </div>
  );
}
