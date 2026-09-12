import Link from "next/link";

export default function HomeHero() {
  return (
    <section className="home-hero relative isolate overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/boats/azimut-55-fly-sifir.jpg)" }}
        aria-hidden
      />
      <div className="home-hero-overlay absolute inset-0" aria-hidden />

      <div className="relative flex min-h-[min(72vh,34rem)] flex-col justify-end px-4 pb-10 pt-16 sm:px-6 sm:pb-12 lg:min-h-[28rem] lg:justify-center lg:px-8">
        <p className="home-hero-fade text-[13px] font-bold tracking-[0.08em] text-turquoise sm:text-[14px]">
          Tekne<span className="text-white">Shop</span>
        </p>
        <h1 className="home-hero-fade-delay mt-3 max-w-xl text-[28px] font-bold leading-tight text-white sm:text-[34px] lg:text-[40px]">
          Sıfır ve ikinci el teknenizi güvenle bulun
        </h1>
        <p className="home-hero-fade-delay-2 mt-3 max-w-lg text-[14px] leading-relaxed text-white/85 sm:text-[15px]">
          Türkiye&apos;nin tekne ilanları — doğrudan satıcıya mesaj ve teklif.
        </p>
        <div className="home-hero-fade-delay-3 mt-6 flex flex-wrap gap-3">
          <Link
            href="/tekne"
            className="btn-cta inline-flex items-center rounded-sm px-5 py-2.5 text-[13px] font-bold transition-transform hover:-translate-y-0.5"
          >
            Tekne ilanlarını gör
          </Link>
          <Link
            href="/ilan-ver"
            className="inline-flex items-center rounded-sm border border-white/40 bg-white/10 px-5 py-2.5 text-[13px] font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Ücretsiz ilan ver
          </Link>
        </div>
      </div>
    </section>
  );
}
