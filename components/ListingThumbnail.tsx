import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  size?: "row" | "detail";
};

export default function ListingThumbnail({ src, alt, size = "row" }: Props) {
  if (size === "detail") {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-[#f0f0f0]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
      </div>
    );
  }

  return (
    <div className="relative h-[72px] w-[96px] shrink-0 overflow-hidden border border-border bg-[#f0f0f0]">
      <Image src={src} alt={alt} fill className="object-cover" sizes="96px" />
    </div>
  );
}
