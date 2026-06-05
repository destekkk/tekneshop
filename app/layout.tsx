import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteShell from "@/components/SiteShell";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TekneShop | Tekne İlanları ve Denizcilik Parçaları",
  description: "Sıfır ve ikinci el tekne ilanları, yedek parça ve denizcilik ekipmanları.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${geist.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <div className="sticky top-0 z-40 bg-card">
          <Header />
        </div>
        <SiteShell>{children}</SiteShell>
        <Footer />
      </body>
    </html>
  );
}
