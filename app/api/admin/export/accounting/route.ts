import { getAdminSession } from "@/lib/admin/session";
import { categoryLabels, getAccountingEntries } from "@/lib/accounting-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await getAccountingEntries();
  const header = ["id", "type", "category", "amount", "description", "entryDate", "status"];
  const lines = [
    header.join(";"),
    ...rows.map((r) =>
      [
        r.id,
        r.type,
        categoryLabels[r.category as keyof typeof categoryLabels] || r.category,
        r.amount,
        `"${(r.description || "").replace(/"/g, '""')}"`,
        r.entryDate?.toISOString().slice(0, 10),
        r.status,
      ].join(";"),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tekneshop-muhasebe-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
