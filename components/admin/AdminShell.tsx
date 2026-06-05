import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f6f8]">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
