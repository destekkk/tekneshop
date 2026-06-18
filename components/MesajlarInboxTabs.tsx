"use client";

import Link from "next/link";

export default function MesajlarInboxTabs({
  activeTab,
  messageCount,
  offerCount,
  pendingOfferCount,
}: {
  activeTab: "mesajlar" | "teklifler";
  messageCount: number;
  offerCount: number;
  pendingOfferCount: number;
}) {
  const tabClass = (tab: "mesajlar" | "teklifler") =>
    `rounded-t border px-4 py-2 text-[13px] font-semibold ${
      activeTab === tab
        ? "border-border border-b-card bg-card text-navy"
        : "border-transparent bg-[#f5f5f5] text-muted hover:text-navy"
    }`;

  return (
    <div className="mb-4 border-b border-border">
      <div className="flex flex-wrap gap-1">
        <Link href="/mesajlar" className={tabClass("mesajlar")}>
          Mesajlar
          {messageCount > 0 ? (
            <span className="ml-1 font-bold text-foreground">({messageCount})</span>
          ) : null}
        </Link>
        <Link href="/mesajlar?tab=teklifler" className={tabClass("teklifler")}>
          Gelen Teklifler
          {pendingOfferCount > 0 ? (
            <span className="ml-1 font-bold text-red-600">({pendingOfferCount})</span>
          ) : offerCount > 0 ? (
            <span className="ml-1 font-bold text-foreground">({offerCount})</span>
          ) : null}
        </Link>
      </div>
    </div>
  );
}
