export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Kullanıcılar</h1>
        <p className="text-[13px] text-muted">
          Üye yönetimi, ban, doğrulama ve ilan geçmişi — ileride Neon + auth ile aktif edilecek.
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-border bg-white p-8 text-center">
        <p className="text-[13px] font-medium">Kullanıcı modülü hazırlanıyor</p>
        <ul className="mx-auto mt-4 max-w-md space-y-1 text-left text-[12px] text-muted">
          <li>• Kayıtlı kullanıcı listesi ve arama</li>
          <li>• E-posta / telefon doğrulama</li>
          <li>• Kullanıcıya ait ilan geçmişi</li>
          <li>• Hesap askıya alma ve ban</li>
          <li>• Kurumsal satıcı (bayi) profilleri</li>
        </ul>
      </div>
    </div>
  );
}
