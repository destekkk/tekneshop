import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl, type WhatsAppContext } from "@/lib/whatsapp";

type Props = {
  number: string;
  siteName: string;
  prefillMessage?: string;
  context?: WhatsAppContext;
  listingTitle?: string;
  listingUrl?: string;
  listingNumber?: number;
  variant?: "inline" | "button" | "floating";
  label?: string;
  className?: string;
};

export default function WhatsAppLink({
  number,
  siteName,
  prefillMessage,
  context = "general",
  listingTitle,
  listingUrl,
  listingNumber,
  variant = "inline",
  label,
  className = "",
}: Props) {
  const href = buildWhatsAppUrl({
    number,
    siteName,
    prefillMessage,
    context,
    listingTitle,
    listingUrl,
    listingNumber,
  });
  if (!href) return null;

  const displayLabel = label || `${siteName} WhatsApp`;

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={displayLabel}
        title={displayLabel}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 py-3 text-white shadow-lg transition hover:scale-105 hover:shadow-xl ${className}`}
      >
        <MessageCircle size={22} />
        <span className="text-[13px] font-bold leading-none">{siteName}</span>
      </a>
    );
  }

  if (variant === "button") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:bg-[#1fb855] ${className}`}
      >
        <MessageCircle size={18} />
        {displayLabel}
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-navy hover:underline ${className}`}
    >
      <MessageCircle size={14} className="text-[#25D366]" />
      {displayLabel}
    </a>
  );
}
