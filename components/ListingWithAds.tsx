import { Fragment, type ReactNode } from "react";
import InlineAdSlot from "@/components/InlineAdSlot";
import { getSiteConfig } from "@/lib/admin/settings";

type Props<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string;
  every?: number;
};

export default async function ListingWithAds<T>({
  items,
  renderItem,
  getKey,
  every = 8,
}: Props<T>) {
  if (items.length === 0) return null;

  const config = await getSiteConfig();
  const showAds = config.adsEnabled;

  let adIndex = 0;

  return (
    <>
      {items.map((item, index) => (
        <Fragment key={getKey(item)}>
          {renderItem(item)}
          {showAds && (index + 1) % every === 0 && index < items.length - 1 && (
            <InlineAdSlot slot={++adIndex} />
          )}
        </Fragment>
      ))}
    </>
  );
}
