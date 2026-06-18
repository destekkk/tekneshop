"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fieldValue, preserveFormKey } from "@/lib/form-preserve";
import type { BuyerInquiryConversation } from "@/lib/listing-inquiries-store";
import { usePreserveFormAction } from "@/lib/use-preserve-form-action";
import { submitListingInquiryAction } from "@/lib/user-actions";

const initial = { ok: false, message: "", error: "" };

const boxClass =
  "w-full rounded-lg border-2 border-navy/25 bg-[#f0f9f8] p-4 shadow-sm";

export default function ListingMessageForm({
  listingId,
  listingSlug,
  listingTitle,
  user,
  conversation,
}: {
  listingId: number;
  listingSlug: string;
  listingTitle: string;
  user: { name: string; email: string } | null;
  conversation?: BuyerInquiryConversation | null;
}) {
  const { state, action, pending, values } = usePreserveFormAction(
    submitListingInquiryAction,
    initial,
  );
  const [successNonce, setSuccessNonce] = useState(0);
  const [justSent, setJustSent] = useState(false);
  const formKey = preserveFormKey(state, values, successNonce);

  const serverWaiting = conversation?.waitingForSeller ?? false;
  const canReplyFromServer = conversation?.canBuyerReply ?? true;
  const locked = justSent || serverWaiting || !canReplyFromServer;
  const canReply = !locked;
  const fields = locked ? {} : values;

  useEffect(() => {
    if (serverWaiting) setJustSent(true);
    if (canReplyFromServer && conversation?.inquiryId) setJustSent(false);
  }, [serverWaiting, canReplyFromServer, conversation?.inquiryId]);

  useEffect(() => {
    if (!state.ok) return;
    setJustSent(true);
    setSuccessNonce((n) => n + 1);
  }, [state.ok, state.message]);

  if (!user) {
    return (
      <div className={boxClass}>
        <p className="text-[16px] font-bold text-navy">Satıcıya mesaj gönder</p>
        <p className="mt-1 text-[13px] text-muted">Mesaj göndermek için giriş yapmanız gerekir.</p>
        <Link
          href={`/giris?redirect=${encodeURIComponent(`/tekne/ilan/${listingSlug}`)}`}
          className="btn-navy mt-4 inline-block rounded-sm px-5 py-2.5 text-[13px] font-bold"
        >
          Giriş yap / Kayıt ol
        </Link>
      </div>
    );
  }

  return (
    <div className={boxClass}>
      <p className="text-[16px] font-bold text-navy">Satıcıya mesaj gönder</p>
      <p className="mt-1 text-[13px] text-muted">
        Telefon gizli — mesajınız satıcıya iletilir.
      </p>

      {locked || state.ok ? (
        <p className="mt-3 rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
          Mesajınız iletildi. İlan veren sizinle iletişime geçebilir.
        </p>
      ) : null}

      {conversation?.lastSellerMessage && canReply ? (
        <div className="mt-3 rounded border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] text-sky-900">
          <p className="font-semibold">İlan veren yanıtladı:</p>
          <p className="mt-1 whitespace-pre-wrap">{conversation.lastSellerMessage}</p>
        </div>
      ) : null}

      {state.error ? (
        <p className="mt-3 rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}

      <p className="mt-4 text-[12px] text-muted">
        Gönderen: <span className="font-medium text-foreground">{user.name}</span> ({user.email})
      </p>

      {locked ? (
        <p className="mt-3 rounded border border-border bg-[#f5f5f5] px-3 py-2 text-[13px] text-muted">
          İlan verenin yanıtını bekleyin. Bu ilana yeni mesaj gönderemezsiniz; diğer ilanlara mesaj
          yazabilirsiniz.
        </p>
      ) : (
        <form key={formKey} action={action} className="mt-3 space-y-3 text-left">
          <input type="hidden" name="listingId" value={listingId} />
          <input type="hidden" name="listingSlug" value={listingSlug} />
          <input type="hidden" name="listingTitle" value={listingTitle} />

          <div>
            <label className="text-[13px] font-semibold text-foreground">Mesajınız *</label>
            <textarea
              name="message"
              required
              rows={3}
              placeholder="Merhaba, bu ilan hakkında bilgi almak istiyorum…"
              defaultValue={fieldValue(fields, "message")}
              className="mt-1 w-full resize-y rounded border border-border bg-white px-3 py-2 text-[14px] outline-none focus:border-navy"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="btn-navy rounded-sm px-6 py-2.5 text-[14px] font-bold disabled:opacity-50"
          >
            {pending ? "Gönderiliyor…" : "Mesaj Gönder"}
          </button>
        </form>
      )}
    </div>
  );
}
