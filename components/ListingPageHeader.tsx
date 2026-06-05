import Breadcrumb from "@/components/Breadcrumb";

type Props = {
  title: string;
  count: number;
  crumbs: { label: string; href?: string }[];
};

export default function ListingPageHeader({ title, count, crumbs }: Props) {
  return (
    <>
      <Breadcrumb items={crumbs} />
      <div className="px-4 py-3">
        <h1 className="text-[18px] font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-[13px] text-muted">{count} ilan bulundu.</p>
      </div>
    </>
  );
}
