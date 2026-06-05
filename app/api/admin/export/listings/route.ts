import { getAdminSession } from "@/lib/admin/session";
import { getAllListingsForExport } from "@/lib/listings-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return new Response("Unauthorized", { status: 401 });
  }

  const rows = await getAllListingsForExport();
  const header = ["listingNumber", "id", "slug", "title", "status", "price", "location", "condition", "boatType", "contactEmail", "createdAt"];
  const lines = [
    header.join(";"),
    ...rows.map((r) =>
      [
        r.listingNumber ?? "",
        r.id,
        r.slug,
        `"${r.title.replace(/"/g, '""')}"`,
        r.status,
        r.price,
        `"${(r.location || "").replace(/"/g, '""')}"`,
        r.condition,
        r.boatType,
        r.contactEmail,
        r.createdAt?.toISOString(),
      ].join(";"),
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tekneshop-ilanlar-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
