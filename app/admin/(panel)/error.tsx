"use client";

export default function AdminPanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-lg border border-rose-200 bg-rose-50 p-6">
      <h1 className="text-lg font-bold text-rose-900">Sayfa yüklenemedi</h1>
      <p className="text-[13px] text-rose-800">
        Yönetim panelinde bir hata oluştu. Veritabanı güncel değilse{" "}
        <code className="rounded bg-rose-100 px-1">npm run db:push</code> çalıştırıp sayfayı
        yenileyin.
      </p>
      {error.digest ? (
        <p className="font-mono text-[11px] text-rose-600">Hata kodu: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="btn-cta rounded-sm px-4 py-2 text-sm font-bold"
      >
        Tekrar dene
      </button>
    </div>
  );
}
