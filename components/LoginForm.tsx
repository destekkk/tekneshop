"use client";

export default function LoginForm() {
  return (
    <form className="space-y-4 p-6">
      <div>
        <label className="text-sm font-medium">E-posta</label>
        <input
          type="email"
          autoComplete="username"
          placeholder="ornek@email.com"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Şifre</label>
        <input
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <button type="button" className="btn-cta w-full rounded-sm py-3 text-sm font-bold">
        Giriş
      </button>
    </form>
  );
}
