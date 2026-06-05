import { notFound } from "next/navigation";
import MagazaListing from "@/components/MagazaListing";
import { magazaHref } from "@/lib/csy-categories";
import { getMainCategory, getMagazaSubParams, getSubCategory } from "@/lib/categories-store";
import { filterCsyProducts } from "@/lib/csy-products";

type Props = { params: Promise<{ category: string; sub: string }> };

export async function generateStaticParams() {
  return getMagazaSubParams();
}

export async function generateMetadata({ params }: Props) {
  const { category, sub } = await params;
  const subCat = await getSubCategory(category, sub);
  return { title: subCat ? `${subCat.label} | TekneShop` : "Mağaza" };
}

export default async function MagazaSubPage({ params }: Props) {
  const { category, sub } = await params;
  const main = await getMainCategory(category);
  const subCat = await getSubCategory(category, sub);
  if (!main || !subCat) notFound();

  const products = filterCsyProducts({ main: category, sub });

  return (
    <MagazaListing
      main={main}
      sub={subCat}
      products={products}
      crumbs={[
        { label: "Ana Sayfa", href: "/" },
        { label: "Marin Mağaza", href: "/magaza" },
        { label: main.label, href: magazaHref(main.slug) },
        { label: subCat.label },
      ]}
    />
  );
}
