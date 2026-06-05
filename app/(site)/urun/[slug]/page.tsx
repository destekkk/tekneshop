import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ListingThumbnail from "@/components/ListingThumbnail";
import { magazaHref } from "@/lib/csy-categories";
import { formatPrice, getCsyProduct } from "@/lib/csy-products";
import { csyProducts } from "@/lib/csy-products";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return csyProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = getCsyProduct(slug);
  return { title: product ? `${product.name} | TekneShop` : "Ürün" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getCsyProduct(slug);
  if (!product) notFound();

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: product.mainLabel, href: magazaHref(product.mainCategory) },
          { label: product.subLabel, href: magazaHref(product.mainCategory, product.subCategory) },
          { label: product.name },
        ]}
      />
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <div className="max-w-md lg:w-1/3">
          <ListingThumbnail src={product.image} alt={product.name} size="detail" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-navy">{product.brand}</p>
          <p className="mt-1 text-[12px] text-muted">
            {product.mainLabel} › {product.subLabel}
          </p>
          {product.discount && (
            <span className="mt-2 inline-block rounded-sm bg-cta px-2 py-0.5 text-[11px] font-bold text-foreground">
              İndirim {product.discount}
            </span>
          )}
          {product.badge && (
            <span className="ml-2 mt-2 inline-block rounded-sm bg-turquoise-light px-2 py-0.5 text-[11px] font-semibold text-navy">
              {product.badge}
            </span>
          )}
          <h1 className="mt-2 text-[20px] font-bold">{product.name}</h1>
          <p className="mt-4 text-[22px] font-bold text-navy">{formatPrice(product.price)}</p>
          <p className="mt-6 text-[13px] leading-relaxed text-muted">{product.description}</p>
          <p className="mt-4 text-[12px] text-muted">
            Tedarik:{" "}
            <a
              href="https://www.csymarine.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-classified hover:underline"
            >
              csymarine.com
            </a>
          </p>
          <button type="button" className="btn-cta mt-6 rounded-sm px-8 py-3 text-sm">
            Sepete ekle (yakında)
          </button>
          <p className="mt-4">
            <Link
              href={magazaHref(product.mainCategory, product.subCategory)}
              className="text-[13px] link-classified hover:underline"
            >
              ← Kategoriye dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
