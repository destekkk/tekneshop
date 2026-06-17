"use client";

import { useState } from "react";
import ListingThumbnail from "@/components/ListingThumbnail";

type Props = {
  images: string[];
  alt: string;
};

export default function ListingImageGallery({ images, alt }: Props) {
  const unique = images.filter((src, i, arr) => src && arr.indexOf(src) === i);
  const [active, setActive] = useState(0);
  if (unique.length === 0) return null;

  const current = unique[active] ?? unique[0];

  return (
    <div className="space-y-3">
      <ListingThumbnail src={current} alt={alt} size="detail" />
      {unique.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {unique.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`aspect-[4/3] overflow-hidden rounded border bg-white ${
                i === active ? "border-navy ring-2 ring-navy/30" : "border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
