"use client";

import { useTransition } from "react";
import { deleteMessageAction, markMessageReadAction } from "@/lib/admin/actions";
import type { ContactMessage } from "@/lib/db/schema";

export default function MessagesManager({
  messages,
  dbConnected,
}: {
  messages: ContactMessage[];
  dbConnected: boolean;
}) {
  const [pending, start] = useTransition();

  if (!dbConnected) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
        Mesajlar için veritabanı gerekli.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <article
          key={m.id}
          className={`rounded-lg border p-4 ${m.read ? "border-border bg-white" : "border-navy/30 bg-[#f0f9f8]"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-bold">{m.subject}</p>
              <p className="text-[12px] text-muted">
                {m.name} · {m.email}
                {m.phone ? ` · ${m.phone}` : ""} ·{" "}
                {new Date(m.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>
            <div className="flex gap-2">
              {!m.read ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => start(() => markMessageReadAction(m.id))}
                  className="rounded bg-navy px-2 py-1 text-[11px] text-white"
                >
                  Okundu
                </button>
              ) : null}
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => deleteMessageAction(m.id))}
                className="text-[11px] text-rose-600"
              >
                Sil
              </button>
            </div>
          </div>
          <p className="mt-2 text-[13px] whitespace-pre-wrap">{m.message}</p>
        </article>
      ))}
      {messages.length === 0 ? (
        <p className="text-[13px] text-muted">Henüz mesaj yok.</p>
      ) : null}
    </div>
  );
}
