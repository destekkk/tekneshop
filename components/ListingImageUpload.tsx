"use client";

import { useEffect, useState } from "react";

export default function ListingImageUpload() {
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([]);

  useEffect(() => {
    return () => {
      for (const p of previews) URL.revokeObjectURL(p.url);
    };
  }, [previews]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    for (const p of previews) URL.revokeObjectURL(p.url);
    const files = Array.from(e.target.files || []).slice(0, 8);
    setPreviews(files.map((f) => ({ url: URL.createObjectURL(f), name: f.name })));
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-[#fafafa] p-4">
      <div>
        <label className="text-sm font-medium">Fotoğraflar</label>
        <p className="mt-1 text-[12px] text-muted">
          En fazla 8 fotoğraf (JPG, PNG, WebP · max 5 MB). İlk fotoğraf kapak görseli olur.
        </p>
        <input
          type="file"
          name="images"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onChange}
          className="mt-2 block w-full text-[13px] file:mr-3 file:rounded file:border-0 file:bg-navy file:px-3 file:py-2 file:text-[12px] file:font-semibold file:text-white hover:file:bg-navy-deep"
        />
      </div>
      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {previews.map((p, i) => (
            <div key={p.url} className="relative aspect-[4/3] overflow-hidden rounded border border-border bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
              {i === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-navy px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Kapak
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
