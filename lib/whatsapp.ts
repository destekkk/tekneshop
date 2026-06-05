import { getSiteUrl } from "@/lib/email/config";

export type WhatsAppContext = "general" | "contact" | "listing";

export function defaultWhatsAppPrefill(siteName: string, siteUrl?: string) {
  const url = siteUrl || getSiteUrl();
  return `Merhaba, *${siteName}* (${url}) üzerinden yazıyorum.`;
}

export function buildWhatsAppUrl(opts: {
  number: string;
  siteName?: string;
  siteUrl?: string;
  prefillMessage?: string;
  context?: WhatsAppContext;
  listingTitle?: string;
  listingUrl?: string;
  listingNumber?: number;
}) {
  const digits = opts.number.replace(/\D/g, "");
  if (!digits) return "";

  const siteName = opts.siteName || "TekneShop";
  const siteUrl = opts.siteUrl || getSiteUrl();

  let message = opts.prefillMessage?.trim();
  if (!message) {
    if (opts.context === "listing" && opts.listingTitle) {
      const noLine = opts.listingNumber ? `İlan No: ${opts.listingNumber}\n` : "";
      message = `Merhaba, *${siteName}* (${siteUrl}) üzerinden yazıyorum.\n\n${noLine}İlan: ${opts.listingTitle}`;
    } else if (opts.context === "contact") {
      message = `Merhaba, *${siteName}* (${siteUrl}) iletişim sayfasından yazıyorum.`;
    } else {
      message = defaultWhatsAppPrefill(siteName, siteUrl);
    }
  }

  if (opts.context === "listing" && opts.listingTitle && !message.includes(opts.listingTitle)) {
    if (opts.listingNumber && !message.includes(String(opts.listingNumber))) {
      message += `\n\nİlan No: ${opts.listingNumber}`;
    }
    message += `\n\nİlan: ${opts.listingTitle}`;
    if (opts.listingUrl) message += `\n${opts.listingUrl}`;
  }

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
