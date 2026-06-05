import { unsubscribeByToken } from "@/lib/email/subscribers-store";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let success = false;

  if (token) {
    success = await unsubscribeByToken(token);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-navy">E-posta aboneliği</h1>
      {!token ? (
        <p className="mt-4 text-[14px] text-muted">Geçersiz bağlantı.</p>
      ) : success ? (
        <p className="mt-4 text-[14px] text-muted">
          Aboneliğiniz iptal edildi. Artık kampanya e-postaları almayacaksınız.
        </p>
      ) : (
        <p className="mt-4 text-[14px] text-muted">
          Bu bağlantı geçersiz veya süresi dolmuş olabilir.
        </p>
      )}
      <a href="/" className="mt-6 inline-block text-[13px] text-navy hover:underline">
        Ana sayfaya dön →
      </a>
    </div>
  );
}
