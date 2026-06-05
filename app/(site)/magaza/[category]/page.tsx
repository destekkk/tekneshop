import { notFound } from "next/navigation";
import MagazaListing from "@/components/MagazaListing";
import { csyCategories, getCsyMain } from "@/lib/csy-categories";
import { filterCsyProducts } from "@/lib/csy-products";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return csyCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const main = getCsyMain(category);
  return { title: main ? `${main.label} | TekneShop` : "Mağaza" };
}

export default async function MagazaCategoryPage({ params }: Props) {
  const { category } = await params;
  const main = getCsyMain(category);
  if (!main) notFound();

  const products = filterCsyProducts({ main: category });

  return (
    <MagazaListing
      main={main}
      products={products}
      crumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Marin Mağaza", href: "/magaza" },
        { label: main.label },
      ]}
    />
  );
}
