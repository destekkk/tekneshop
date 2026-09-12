export default function HomeTrustStrip() {
  const items = [
    {
      title: "Doğrudan satıcıya mesaj",
      text: "Telefon numarası gizli kalır; iletişim ilan üzerinden yürür.",
    },
    {
      title: "Teklif sistemi",
      text: "Fiyatı konuşun — satıcı onaylayınca iletişim bilgisi açılır.",
    },
    {
      title: "Ücretsiz ilan",
      text: "Teknenizi dakikalar içinde vitrine koyun, alıcılarla buluşun.",
    },
  ];

  return (
    <section className="border-b border-border bg-white px-4 py-8 sm:px-6">
      <h2 className="text-[15px] font-bold text-navy">Neden TekneShop?</h2>
      <p className="mt-1 max-w-2xl text-[13px] text-muted">
        Alıcı ve satıcıyı güvenli, sade bir akışta buluşturuyoruz.
      </p>
      <ul className="mt-5 grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.title}>
            <p className="text-[13px] font-semibold text-foreground">{item.title}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
