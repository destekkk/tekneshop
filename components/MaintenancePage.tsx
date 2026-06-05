export default function MaintenancePage({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-lg border border-border bg-white p-8 shadow-sm">
        <p className="text-4xl">⚓</p>
        <h1 className="mt-4 text-xl font-bold text-navy">Bakım çalışması</h1>
        <p className="mt-3 text-[14px] text-muted">{message}</p>
        <p className="mt-6 text-[12px] text-muted">
          Yönetici paneli etkilenmez —{" "}
          <a href="/admin" className="text-navy hover:underline">
            /admin
          </a>
        </p>
      </div>
    </div>
  );
}
