import { actionLabels, getRecentActivity } from "@/lib/activity-log-store";
import { isDbConfigured } from "@/lib/db";

export default async function AdminActivityPage() {
  const logs = await getRecentActivity(50);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Aktivite Günlüğü</h1>
        <p className="text-[13px] text-muted">Admin panelinde yapılan son işlemler</p>
      </div>

      {!isDbConfigured() ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
          Aktivite günlüğü için veritabanı gerekli.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafafa] text-[12px] text-muted">
              <tr>
                <th className="px-3 py-2">Zaman</th>
                <th className="px-3 py-2">İşlem</th>
                <th className="px-3 py-2">Admin</th>
                <th className="px-3 py-2">Detay</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("tr-TR")}
                  </td>
                  <td className="px-3 py-2">{actionLabels[log.action] || log.action}</td>
                  <td className="px-3 py-2">{log.adminEmail || "—"}</td>
                  <td className="px-3 py-2 text-[12px] text-muted">
                    {log.entityType}
                    {log.entityId ? ` #${log.entityId}` : ""}
                    {log.details ? ` · ${JSON.stringify(log.details)}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 ? (
            <p className="p-6 text-center text-muted">Henüz kayıt yok.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
