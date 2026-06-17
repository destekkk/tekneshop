"use client";

import { useEffect, useRef, useState } from "react";

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
    const next = [...files, ...picked].slice(0, 8);
    setFiles(next);
    syncPreviews(next);
    e.target.value = "";
  }

  function removeAt(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    syncPreviews(next);
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-[#fafafa] p-4">
      <div>
        <label className="text-sm font-medium">Fotoğraflar</label>
        <p className="mt-1 text-[12px] text-muted">
          En fazla 8 fotoğraf (JPG, PNG, WebP · max 5 MB). İlk fotoğraf kapak görseli olur.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onPick}
          className="mt-2 block w-full text-[13px] file:mr-3 file:rounded file:border-0 file:bg-navy file:px-3 file:py-2 file:text-[12px] file:font-semibold file:text-white hover:file:bg-navy-deep"
        />
        {files.length > 0 && files.length < 8 ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 text-[12px] font-medium text-navy hover:underline"
          >
            + Başka fotoğraf ekle ({files.length}/8)
          </button>
        ) : null}
      </div>
      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="group relative aspect-[4/3] overflow-hidden rounded border border-border bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
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
          ))}
        </div>
      ) : null}
    </div>
  );
}
