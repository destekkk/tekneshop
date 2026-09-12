import Link from "next/link";

export default function HomeSellerCta() {
  return (
    <section className="border-b border-border bg-navy px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h2 className="text-[18px] font-bold text-white sm:text-[20px]">
          Teknenizi satmaya hazır mısınız?
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-white/80">
          Fotoğraf ekleyin, fiyatı yazın — alıcılar size mesaj ve teklif göndersin.
        </p>
        <Link
          href="/ilan-ver"
          className="btn-cta mt-5 inline-flex rounded-sm px-5 py-2.5 text-[13px] font-bold transition-transform hover:-translate-y-0.5"
        >
          Ücretsiz ilan ver
        </Link>
      </div>
    </section>
  );
}
