import { adminLoginAction } from "@/lib/admin/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] p-4">
      <form
        action={adminLoginAction}
        className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-white p-6 shadow-sm"
      >
        <div>
          <h1 className="text-lg font-bold text-navy">TekneShop Admin</h1>
          <p className="mt-1 text-[12px] text-muted">Yönetim paneline giriş yapın</p>
          {params.error ? (
            <p className="mt-2 rounded bg-rose-50 px-2 py-1 text-[12px] text-rose-700">
              E-posta veya şifre hatalı
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-sm font-medium">E-posta</label>
          <input
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="ornek@tekneshop.com"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Şifre</label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="btn-cta w-full rounded-sm py-2.5 text-sm font-bold">
          Giriş Yap
        </button>
        <p className="text-[11px] text-muted">
          Giriş bilgileri Vercel ortam değişkenlerindeki ADMIN_EMAIL ve ADMIN_PASSWORD ile
          belirlenir.
        </p>
      </form>
    </div>
  );
}
