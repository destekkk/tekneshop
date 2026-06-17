import Link from "next/link";
import ListingPageHeader from "@/components/ListingPageHeader";
import SellerInquiriesManager from "@/components/SellerInquiriesManager";
import { requireUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getListingInquiriesForOwner } from "@/lib/listing-inquiries-store";

export const metadata = { title: "İlan Mesajlarım | TekneShop" };

export default async function MesajlarPage() {
  const user = await requireUser("/mesajlar");
  const inquiries = isDbConfigured() ? await getListingInquiriesForOwner(user.email) : [];

  return (
    <>
      <ListingPageHeader
        title="İlan Mesajlarım"
        count={inquiries.length}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "İlan Mesajlarım" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <p className="mb-4 text-[13px] text-muted">
          Telefonu gizlediğiniz ilanlara gelen mesajlar burada listelenir. Uygunsuz mesajları{" "}
          <strong className="text-foreground">şikayet et</strong> ile yönetime iletebilirsiniz.
        </p>
        {!isDbConfigured() ? (
          <p className="rounded-lg border border-border bg-[#fafafa] px-4 py-3 text-[13px] text-muted">
            Mesajlar için veritabanı bağlantısı gerekli.
          </p>
        ) : (
          <SellerInquiriesManager inquiries={inquiries} />
        )}
        <p className="mt-6">
          <Link href="/ilan-ver" className="text-[13px] text-navy hover:underline">
            ← İlan ver
          </Link>
        </p>
      </div>
    </>
  );
}
