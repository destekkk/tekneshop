import { redirect } from "next/navigation";

export default function AdminPendingListingsRedirect() {
  redirect("/admin/ilanlar?tab=bekleyen");
}
