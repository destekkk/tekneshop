"use client";

import { useEffect, useRef, useState } from "react";

const MAX_PHOTOS = 8;

type Props = {
  onFilesChange?: (files: File[]) => void;
};

export default function ListingImageUpload({ onFilesChange }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onFilesChange?.(files);
  }, [files, onFilesChange]);

  useEffect(() => {
    return () => {
      for (const p of previews) URL.revokeObjectURL(p.url);
    };
  }, [previews]);

  function syncPreviews(nextFiles: File[]) {
    for (const p of previews) URL.revokeObjectURL(p.url);
    setPreviews(nextFiles.map((f) => ({ url: URL.createObjectURL(f), name: f.name })));
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    const next = [...files, ...picked].slice(0, MAX_PHOTOS);
    setFiles(next);
    syncPreviews(next);
    e.target.value = "";
  }

  function removeAt(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    syncPreviews(next);
  }

  function openPicker() {
    if (files.length >= MAX_PHOTOS) return;
    inputRef.current?.click();
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-[#fafafa] p-4">
      <div>
        <label className="text-sm font-medium">Fotoğraflar</label>
        <p className="mt-1 text-[12px] text-muted">
          En fazla {MAX_PHOTOS} fotoğraf (JPG, PNG, WebP · max 5 MB). İlk fotoğraf kapak görseli olur.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={onPick}
        className="sr-only"
        aria-hidden
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: MAX_PHOTOS }, (_, i) => {
          const preview = previews[i];

          if (preview) {
            return (
              <div
                key={`photo-${i}`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
                {i === 0 ? (
                  <span className="absolute left-1.5 top-1.5 z-10 rounded bg-navy px-1.5 py-0.5 text-[10px] font-bold text-white">
                    Kapak
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  title="Fotoğrafı kaldır"
                  aria-label="Fotoğrafı kaldır"
                  className="absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-[16px] font-bold leading-none text-white shadow-md transition hover:bg-rose-700"
                >
                  ×
                </button>
              </div>
            );
          }

          const canAdd = files.length < MAX_PHOTOS;

          return (
            <button
              key={`slot-${i}`}
              type="button"
              onClick={canAdd ? openPicker : undefined}
              disabled={!canAdd}
              title={canAdd ? "Fotoğraf ekle" : undefined}
              aria-label={canAdd ? "Fotoğraf ekle" : undefined}
              className={`flex aspect-square items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                canAdd
                  ? "cursor-pointer border-[#c5d0db] bg-white text-navy hover:border-navy hover:bg-[#f4f8fb]"
                  : "cursor-default border-[#e8ecf0] bg-[#f8f9fa] text-[#d0d5db]"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-[28px] font-light leading-none ${
                  canAdd ? "bg-[#eef3f7] text-navy" : "bg-transparent text-[#d8dde3]"
                }`}
              >
                +
              </span>
            </button>
          );
        })}
      </div>

      {files.length > 0 ? (
        <p className="text-[12px] text-muted">
          {files.length}/{MAX_PHOTOS} fotoğraf seçildi
        </p>
      ) : null}
    </div>
  );
}
