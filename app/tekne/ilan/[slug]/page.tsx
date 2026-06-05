import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ListingThumbnail from "@/components/ListingThumbnail";
import {
  boatTypeLabels,
  conditionLabels,
  formatPrice,
  getBoat,
  boatListings,
} from "@/lib/boats";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return boatListings.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const boat = getBoat(slug);
  return { title: boat ? `${boat.title} | TekneShop` : "İlan" };
}

export default async function BoatDetailPage({ params }: Props) {
  const { slug } = await params;
  const boat = getBoat(slug);
  if (!boat) notFound();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tekne İlanları", href: "/tekne" },
          { label: boat.title },
        ]}
      />
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <div className="max-w-lg lg:w-2/5">
          <ListingThumbnail src={boat.image} alt={boat.title} size="detail" />
        </div>
        <div className="flex-1">
          <h1 className="text-[20px] font-bold text-foreground">{boat.title}</h1>
          <p className="mt-3 text-[22px] font-bold text-navy">{formatPrice(boat.price)}</p>
          <table className="mt-6 w-full max-w-md border-collapse text-[13px]">
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">İlan tipi</td>
                <td className="py-2 font-medium">{conditionLabels[boat.condition]}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Kategori</td>
                <td className="py-2 font-medium">{boatTypeLabels[boat.boatType]}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Yıl</td>
                <td className="py-2 font-medium">{boat.year}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Boy</td>
                <td className="py-2 font-medium">{boat.lengthM} m</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Konum</td>
                <td className="py-2 font-medium">{boat.location}</td>
              </tr>
              {boat.engine && (
                <tr className="border-b border-border">
                  <td className="py-2 pr-4 text-muted">Motor</td>
                  <td className="py-2 font-medium">{boat.engine}</td>
                </tr>
              )}
            </tbody>
          </table>
          <button type="button" className="btn-cta mt-8 rounded-sm px-8 py-3 text-sm">
            Satıcıya mesaj gönder (yakında)
          </button>
          <p className="mt-4">
            <Link href="/tekne" className="text-[13px] link-classified hover:underline">
              ← Listeye dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
