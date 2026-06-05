"use client";

import { useState, useTransition } from "react";
import { deleteUserAction, saveUserAction } from "@/lib/admin/actions";
import { maskTcKimlikNo } from "@/lib/auth/tc";
import type { User } from "@/lib/db/schema";

type Props = {
  users: User[];
  dbConnected: boolean;
};

export default function UsersManager({ users, dbConnected }: Props) {
  const [pending, start] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);

  if (!dbConnected) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
        Kullanıcı yönetimi için Neon veritabanı gerekli.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Yeni kullanıcı ekle</h2>
        <form
          action={(fd) => start(() => saveUserAction(fd))}
          className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="text-[12px] font-medium">Ad Soyad *</label>
            <input name="name" required className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">TC Kimlik No *</label>
            <input
              name="tcNo"
              required
              maxLength={11}
              inputMode="numeric"
              pattern="\d{11}"
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium">E-posta *</label>
            <input name="email" type="email" required className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">Telefon</label>
            <input name="phone" type="tel" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">Şifre *</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input name="active" type="checkbox" defaultChecked />
            Aktif hesap
          </label>
          <button
            type="submit"
            disabled={pending}
            className="btn-cta rounded-sm px-4 py-2 text-sm font-bold sm:col-span-2 lg:col-span-3"
          >
            Kullanıcı ekle
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-border bg-white">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold">Kayıtlı kullanıcılar ({users.length})</h2>
        </div>

        {users.length === 0 ? (
          <p className="p-8 text-center text-[13px] text-muted">Henüz kullanıcı yok.</p>
        ) : (
          <div className="divide-y divide-border">
            {users.map((u) => (
              <article key={u.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-navy">{u.name}</h3>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          u.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {u.active ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-muted">
                      {u.email} · {maskTcKimlikNo(u.tcNo)}
                      {u.phone ? ` · ${u.phone}` : ""}
                    </p>
                    <p className="text-[11px] text-muted">
                      Kayıt: {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(editingId === u.id ? null : u.id)}
                      className="rounded border border-border px-3 py-1 text-[12px] font-semibold hover:bg-[#fafafa]"
                    >
                      {editingId === u.id ? "Kapat" : "Düzenle"}
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (confirm(`"${u.name}" silinsin mi?`)) {
                          start(() => deleteUserAction(u.id));
                        }
                      }}
                      className="rounded border border-rose-200 bg-rose-50 px-3 py-1 text-[12px] font-semibold text-rose-700"
                    >
                      Sil
                    </button>
                  </div>
                </div>

                {editingId === u.id ? (
                  <form
                    action={(fd) => start(() => saveUserAction(fd))}
                    className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <input type="hidden" name="id" value={u.id} />
                    <div>
                      <label className="text-[12px] font-medium">Ad Soyad</label>
                      <input
                        name="name"
                        defaultValue={u.name}
                        required
                        className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">TC Kimlik No</label>
                      <input
                        name="tcNo"
                        defaultValue={u.tcNo}
                        required
                        maxLength={11}
                        className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">E-posta</label>
                      <input
                        name="email"
                        type="email"
                        defaultValue={u.email}
                        required
                        className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">Telefon</label>
                      <input
                        name="phone"
                        type="tel"
                        defaultValue={u.phone || ""}
                        className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">Yeni şifre</label>
                      <input
                        name="password"
                        type="password"
                        minLength={6}
                        placeholder="Boş bırakılırsa değişmez"
                        className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
                      />
                    </div>
                    <label className="flex items-center gap-2 self-end pb-2 text-sm">
                      <input name="active" type="checkbox" defaultChecked={u.active} />
                      Aktif hesap
                    </label>
                    <button
                      type="submit"
                      disabled={pending}
                      className="rounded border border-border bg-[#fafafa] px-4 py-2 text-[12px] font-semibold hover:bg-border/40 sm:col-span-2 lg:col-span-3"
                    >
                      Güncelle
                    </button>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
