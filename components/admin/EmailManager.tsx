"use client";

import { useState } from "react";
import {
  deleteSubscriberAction,
  sendEmailCampaignAction,
  sendTestEmailAction,
  syncEmailSubscribersAction,
} from "@/lib/admin/actions";
import type { EmailCampaign, EmailSubscriber } from "@/lib/db/schema";
import { sourceLabels, type SubscriberSource } from "@/lib/email/subscribers-store";

export default function EmailManager({
  subscribers,
  campaigns,
  stats,
  emailConfigured,
  adminEmail,
}: {
  subscribers: EmailSubscriber[];
  campaigns: EmailCampaign[];
  stats: { total: number; active: number; unsubscribed: number };
  emailConfigured: boolean;
  adminEmail: string;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSync() {
    setMessage("");
    setError("");
    const result = await syncEmailSubscribersAction();
    if (result.error) setError(result.error);
    else setMessage(result.message || "Liste güncellendi.");
  }

  async function handleTest(formData: FormData) {
    setSending(true);
    setMessage("");
    setError("");
    const result = await sendTestEmailAction(formData);
    setSending(false);
    if (result.error) setError(result.error);
    else setMessage(result.message || "Test e-postası gönderildi.");
  }

  async function handleCampaign(formData: FormData) {
    if (!confirm(`${stats.active} kişiye e-posta gönderilecek. Emin misiniz?`)) return;
    setSending(true);
    setMessage("");
    setError("");
    const result = await sendEmailCampaignAction(formData);
    setSending(false);
    if (result.error) setError(result.error);
    else setMessage(result.message || "Gönderim tamamlandı.");
  }

  return (
    <div className="space-y-6">
      {!emailConfigured ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          <strong>E-posta servisi bağlı değil.</strong> Vercel ortam değişkenlerine{" "}
          <code className="rounded bg-amber-100 px-1">RESEND_API_KEY</code> ve{" "}
          <code className="rounded bg-amber-100 px-1">EMAIL_FROM</code> ekleyin. Resend&apos;de
          domain doğrulaması (SPF/DKIM) yapmadan mailler spam&apos;e düşebilir.
        </div>
      ) : null}

      {message ? (
        <p className="rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{message}</p>
      ) : null}
      {error ? (
        <p className="rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{error}</p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Toplam kayıt", stats.total],
          ["Aktif abone", stats.active],
          ["Abonelik iptal", stats.unsubscribed],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-lg border border-border bg-white p-4">
            <p className="text-[12px] text-muted">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Abone listesini güncelle</h2>
        <p className="mt-1 text-[12px] text-muted">
          İlan verenler, iletişim formu ve muhasebe kayıtlarındaki e-postalar listeye eklenir.
        </p>
        <button
          type="button"
          onClick={handleSync}
          className="mt-3 rounded border border-border px-3 py-2 text-[12px] font-semibold hover:bg-[#fafafa]"
        >
          Listeyi senkronize et
        </button>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-white p-4">
          <h2 className="text-sm font-bold">Test e-postası</h2>
          <p className="mt-1 text-[12px] text-muted">
            Önce kendinize ({adminEmail}) test gönderin.
          </p>
          <form action={handleTest} className="mt-3 space-y-3">
            <div>
              <label className="text-[12px] font-medium">Konu</label>
              <input
                name="subject"
                defaultValue="TekneShop test e-postası"
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium">Mesaj</label>
              <textarea
                name="body"
                rows={4}
                defaultValue="Merhaba, bu bir test e-postasıdır."
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={sending || !emailConfigured}
              className="rounded bg-navy px-4 py-2 text-[12px] font-semibold text-white disabled:opacity-50"
            >
              Test gönder
            </button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-white p-4">
          <h2 className="text-sm font-bold">Toplu e-posta gönder</h2>
          <p className="mt-1 text-[12px] text-muted">
            {stats.active} aktif aboneye gönderilir. Spam riskini azaltmak için kısa, net konu
            kullanın.
          </p>
          <form action={handleCampaign} className="mt-3 space-y-3">
            <div>
              <label className="text-[12px] font-medium">Konu *</label>
              <input
                name="subject"
                required
                placeholder="Yeni kampanya veya duyuru"
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium">Mesaj *</label>
              <textarea
                name="body"
                required
                rows={6}
                placeholder="Merhaba,&#10;&#10;Yeni ilanlarımızı inceleyin..."
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={sending || !emailConfigured || stats.active === 0}
              className="rounded bg-turquoise px-4 py-2 text-[12px] font-bold text-navy disabled:opacity-50"
            >
              {sending ? "Gönderiliyor…" : `${stats.active} kişiye gönder`}
            </button>
          </form>
        </section>
      </div>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Abone listesi</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-2 py-2">E-posta</th>
                <th className="px-2 py-2">Kaynak</th>
                <th className="px-2 py-2">Durum</th>
                <th className="px-2 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {subscribers.slice(0, 50).map((s) => (
                <tr key={s.id} className="border-b border-border/60">
                  <td className="px-2 py-2">{s.email}</td>
                  <td className="px-2 py-2">{sourceLabels[s.source as SubscriberSource] || s.source}</td>
                  <td className="px-2 py-2">{s.subscribed ? "Aktif" : "İptal"}</td>
                  <td className="px-2 py-2">
                    <form action={deleteSubscriberAction.bind(null, s.id)}>
                      <button type="submit" className="text-rose-600 hover:underline">
                        Sil
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subscribers.length === 0 ? (
            <p className="py-4 text-center text-muted">Henüz abone yok — senkronize edin.</p>
          ) : null}
          {subscribers.length > 50 ? (
            <p className="mt-2 text-[11px] text-muted">İlk 50 kayıt gösteriliyor.</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Gönderim geçmişi</h2>
        <ul className="mt-3 space-y-2 text-[12px]">
          {campaigns.map((c) => (
            <li key={c.id} className="flex flex-wrap justify-between gap-2 border-b border-border/60 pb-2">
              <span>
                <strong>{c.subject}</strong> — {c.sentCount}/{c.recipientCount} gönderildi
                {c.failedCount ? ` (${c.failedCount} hata)` : ""}
              </span>
              <span className="text-muted">
                {c.sentAt
                  ? new Date(c.sentAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })
                  : new Date(c.createdAt).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
              </span>
            </li>
          ))}
          {campaigns.length === 0 ? <li className="text-muted">Henüz gönderim yok.</li> : null}
        </ul>
      </section>

      <section className="rounded-lg border border-dashed border-border bg-[#fafafa] p-4 text-[12px] text-muted">
        <h2 className="font-bold text-foreground">Spam&apos;e düşmemek için</h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-navy hover:underline">
              Resend
            </a>
            {" "}üzerinde <strong>tekneshop.com</strong> domain doğrulaması yapın (SPF + DKIM).
          </li>
          <li>
            <code>EMAIL_FROM</code> değerini doğrulanmış domain ile ayarlayın:{" "}
            <code>TekneShop &lt;bildirim@tekneshop.com&gt;</code>
          </li>
          <li>Günde çok fazla toplu mail göndermeyin; önce test maili atın.</li>
          <li>Her mailde otomatik &quot;Abonelikten çık&quot; linki eklenir.</li>
        </ul>
      </section>
    </div>
  );
}
