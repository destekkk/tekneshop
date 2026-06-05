import { notFound } from "next/navigation";
import MagazaListing from "@/components/MagazaListing";
import { getMainCategory, getMagazaCategorySlugs } from "@/lib/categories-store";
import { filterCsyProducts } from "@/lib/csy-products";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const slugs = await getMagazaCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const main = await getMainCategory(category);
  return { title: main ? `${main.label} | TekneShop` : "Mağaza" };
}

export default async function MagazaCategoryPage({ params }: Props) {
  const { category } = await params;
  const main = await getMainCategory(category);
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
