import { redirect } from "next/navigation";

const legacyMap: Record<string, string> = {
  "motor-yakit": "/magaza/motor-aksami/motor-yagi",
  guvenlik: "/magaza/tekne-malzemeleri/guvenlik",
  navigasyon: "/magaza/elektronik/balik-bulucular",
  bakim: "/magaza/boya-bakim/temizlik-kimyasal",
  konfor: "/magaza/elektrik",
  pervane: "/magaza/motor-aksami/pervane",
};

type Props = { params: Promise<{ slug: string }> };

export default async function ParcalarLegacyPage({ params }: Props) {
  const { slug } = await params;
  redirect(legacyMap[slug] ?? "/magaza");
}
