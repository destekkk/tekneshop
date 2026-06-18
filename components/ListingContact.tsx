import ListingMessageForm from "@/components/ListingMessageForm";
import WhatsAppLink from "@/components/WhatsAppLink";
import { isDbConfigured } from "@/lib/db";
import { getBuyerInquiryConversation } from "@/lib/listing-inquiries-store";
import type { Listing } from "@/lib/db/schema";

function formatPhoneDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  }
  return phone;
}

export default async function ListingContact({
  listing,
  listingSlug,
  listingTitle,
  listingUrl,
  listingNumber,
  siteName,
  user,
}: {
  listing: Listing;
  listingSlug: string;
  listingTitle: string;
  listingUrl: string;
  listingNumber?: number;
  siteName: string;
  user: { id: number; name: string; email: string } | null;
}) {
  if (listing.showContactPhone && listing.contactPhone) {
    const telHref = `tel:${listing.contactPhone.replace(/\s/g, "")}`;
    return (
      <div className="rounded-lg border border-border bg-white p-4">
        <p className="text-[13px] font-semibold text-navy">İlan veren iletişim</p>
        {listing.contactName ? (
          <p className="mt-2 text-[13px]">
            <span className="text-muted">Ad:</span> {listing.contactName}
          </p>
        ) : null}
        <p className="mt-1 text-[18px] font-bold text-navy">
          <a href={telHref} className="hover:underline">
            {formatPhoneDisplay(listing.contactPhone)}
          </a>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={telHref}
            className="btn-cta inline-flex rounded-sm px-6 py-2.5 text-sm font-bold"
          >
            Telefon et
          </a>
          <WhatsAppLink
            number={listing.contactPhone}
            siteName={siteName}
            context="listing"
            listingTitle={listingTitle}
            listingUrl={listingUrl}
            listingNumber={listingNumber}
            variant="button"
            label="WhatsApp ile yaz"
          />
        </div>
      </div>
    );
  }

  const conversation =
    user && isDbConfigured()
      ? await getBuyerInquiryConversation(listing.id, user.id, user.email)
      : null;

  return (
    <div className="space-y-3">
      {listing.contactName ? (
        <p className="text-[13px] text-muted">
          İlan veren: <span className="font-semibold text-foreground">{listing.contactName}</span>
        </p>
      ) : null}
      <ListingMessageForm
        listingId={listing.id}
        listingSlug={listingSlug}
        listingTitle={listingTitle}
        user={user}
        conversation={conversation}
      />
    </div>
  );
}
