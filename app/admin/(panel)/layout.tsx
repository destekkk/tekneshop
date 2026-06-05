import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Yönetim Paneli | TekneShop",
};

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
