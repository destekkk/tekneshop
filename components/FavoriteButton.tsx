"use client";

import { useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/lib/user-actions";

type Props = {
  kind: "listing" | "product";
  slug: string;
  productName?: string;
  initialFavorited?: boolean;
  compact?: boolean;
};

export default function FavoriteButton({
  kind,
  slug,
  productName,
  initialFavorited = false,
  compact = false,
}: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction({ kind, slug, productName });
        if (result.ok) {
          setFavorited(result.favorited);
        } else if (result.error) {
          setError(result.error);
        }
      } catch {
        // redirect to login
      }
    });
  }

  const label = favorited ? "Favorilerden çıkar" : "Favorilere ekle";

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        title={label}
        aria-label={label}
        className={
          compact
            ? `rounded border px-2 py-1.5 text-[18px] leading-none transition-colors disabled:opacity-50 ${
                favorited
                  ? "border-rose-300 bg-rose-50 text-rose-600"
                  : "border-border bg-card text-muted hover:border-navy hover:text-navy"
              }`
            : `inline-flex items-center gap-2 rounded border px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-50 ${
                favorited
                  ? "border-rose-300 bg-rose-50 text-rose-600"
                  : "border-border bg-card text-foreground hover:border-navy hover:text-navy"
              }`
        }
      >
        <span aria-hidden>{favorited ? "♥" : "♡"}</span>
        {!compact ? <span>{favorited ? "Favoride" : "Favorilere ekle"}</span> : null}
      </button>
      {error ? <p className="mt-1 max-w-[120px] text-center text-[10px] text-rose-600">{error}</p> : null}
    </div>
  );
}
