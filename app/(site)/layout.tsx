import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteShell from "@/components/SiteShell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sticky top-0 z-40 bg-card">
        <Header />
      </div>
      <SiteShell>{children}</SiteShell>
      <Footer />
    </>
  );
}
