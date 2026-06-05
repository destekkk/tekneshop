import UsersManager from "@/components/admin/UsersManager";
import { isDbConfigured } from "@/lib/db";
import { getUsers } from "@/lib/users-store";

export default async function AdminUsersPage() {
  const rows = await getUsers();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Kullanıcılar</h1>
        <p className="text-[13px] text-muted">
          Üye ekleme, düzenleme ve hesap yönetimi
        </p>
      </div>
      <UsersManager users={rows} dbConnected={isDbConfigured()} />
    </div>
  );
}
