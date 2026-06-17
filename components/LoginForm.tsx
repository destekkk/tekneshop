"use client";

import Link from "next/link";
import { fieldValue, preserveFormKey } from "@/lib/form-preserve";
import { usePreserveFormAction } from "@/lib/use-preserve-form-action";
import { loginUserAction } from "@/lib/user-actions";

const initial = { ok: false, message: "", error: "" };

export default function LoginForm({
  embedded = false,
  redirectTo = "/",
}: {
  embedded?: boolean;
  redirectTo?: string;
}) {
  const { state, action, pending, values } = usePreserveFormAction(loginUserAction, initial);
  const formKey = preserveFormKey(state, values);

  return (
    <form
      key={formKey}
      action={action}
      className={`space-y-4 p-6 ${embedded ? "" : "rounded-xl border border-border bg-card"}`}
    >
      <input type="hidden" name="redirect" value={redirectTo} />

      {state.error ? (
        <p className="rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}

      <div>
        <label className="text-sm font-medium">E-posta</label>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="ornek@email.com"
          defaultValue={fieldValue(values, "email")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Şifre</label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          defaultValue={fieldValue(values, "password")}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-cta w-full rounded-sm py-3 text-sm font-bold disabled:opacity-50"
      >
        {pending ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>

      {!embedded ? (
        <p className="text-center text-[12px] text-muted">
          Hesabınız yok mu?{" "}
          <Link href="/giris?tab=kayit" className="text-navy hover:underline">
            Kayıt olun
          </Link>
        </p>
      ) : null}
    </form>
  );
}
