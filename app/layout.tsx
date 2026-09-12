import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/email/config";

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TekneShop | Sıfır ve İkinci El Tekne İlanları",
    template: "%s | TekneShop",
  },
  description:
    "Sıfır ve ikinci el tekne, yat, yelkenli ve jet ski ilanları. Doğrudan satıcıya mesaj ve teklif — TekneShop.",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "TekneShop",
    title: "TekneShop | Sıfır ve İkinci El Tekne İlanları",
    description:
      "Sıfır ve ikinci el tekne ilanları. Doğrudan satıcıya mesaj ve teklif sistemi.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "TekneShop | Tekne İlanları",
    description: "Sıfır ve ikinci el tekne ilanlarını inceleyin.",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${dmSans.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
