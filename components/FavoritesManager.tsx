"use client";

import Link from "next/link";
import { useActionState } from "react";
import { removeFavoriteAction } from "@/lib/user-actions";

const removeInitial = { ok: false, message: "", error: "" };

export type FavoriteViewItem = {
  id: number;
  kind: "listing" | "product";
  title: string;
  href: string;
  priceText?: string;
  priceHistory: { priceText: string; recordedAt: string; source: string }[];
};

export type PriceAlertView = {
  id: number;
  message: string;
  listingHref?: string;
  createdAt: string;
};

function RemoveFavoriteForm({ favoriteId }: { favoriteId: number }) {
  const [state, action, pending] = useActionState(removeFavoriteAction, removeInitial);

  if (state.ok) {
    return <p className="text-[11px] text-emerald-700">{state.message}</p>;
  }

  return (
    <form action={action}>
      <input type="hidden" name="favoriteId" value={favoriteId} />
      {state.error ? <p className="mb-1 text-[11px] text-rose-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="text-[12px] font-medium text-rose-700 hover:underline disabled:opacity-50"
      >
        {pending ? "Kaldırılıyor…" : "Favorilerden kaldır"}
      </button>
    </form>
  );
}

export default function FavoritesManager({
  favorites,
  alerts,
}: {
  favorites: FavoriteViewItem[];
  alerts: PriceAlertView[];
}) {
  return (
    <div className="space-y-8">
      {alerts.length > 0 ? (
        <section>
          <h2 className="text-[15px] font-bold text-navy">Fiyat değişikliği bildirimleri</h2>
          <p className="mt-1 text-[12px] text-muted">
            Favori ilanlarınızdaki fiyat güncellemeleri burada listelenir.
          </p>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
            {alerts.map((alert) => (
              <li key={alert.id} className="px-4 py-3">
                <p className="text-[13px] text-foreground">{alert.message}</p>
                <p className="mt-1 text-[11px] text-muted">{alert.createdAt}</p>
                {alert.listingHref ? (
                  <Link href={alert.listingHref} className="mt-1 inline-block text-[12px] text-navy hover:underline">
                    İlanı görüntüle →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-[15px] font-bold text-navy">Favorilerim ({favorites.length})</h2>
        {favorites.length === 0 ? (
          <p className="mt-4 rounded-lg border border-border bg-[#fafafa] px-4 py-6 text-center text-[13px] text-muted">
            Henüz favori eklemediniz.{" "}
            <Link href="/tekne" className="text-navy hover:underline">
              Tekne ilanları
            </Link>{" "}
            veya{" "}
            <Link href="/magaza" className="text-navy hover:underline">
              mağaza
            </Link>{" "}
            sayfalarından ♡ ile ekleyebilirsiniz.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
            {favorites.map((item) => (
              <li key={item.id} className="px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      {item.kind === "listing" ? "Tekne ilanı" : "Mağaza ürünü"}
                    </p>
                    <Link href={item.href} className="mt-0.5 block text-[15px] font-bold text-navy hover:underline">
                      {item.title}
                    </Link>
                    {item.priceText ? (
                      <p className="mt-1 text-[14px] font-semibold text-foreground">{item.priceText}</p>
                    ) : null}
                  </div>
                  <RemoveFavoriteForm favoriteId={item.id} />
                </div>

                {item.kind === "listing" && item.priceHistory.length > 0 ? (
                  <div className="mt-4 rounded border border-border bg-[#fafafa] p-3">
                    <p className="text-[12px] font-semibold text-navy">Son fiyat değişimleri (en fazla 10)</p>
                    <ol className="mt-2 space-y-1.5">
                      {item.priceHistory.map((entry, index) => (
                        <li key={`${item.id}-${index}`} className="flex flex-wrap items-baseline justify-between gap-2 text-[12px]">
                          <span className="font-medium text-foreground">{entry.priceText}</span>
                          <span className="text-muted">{entry.recordedAt}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
