"use client";

import Link from "next/link";

export default function TekliflerInboxTabs({
  activeTab,
  sentCount,
  receivedCount,
  pendingReceivedCount,
  unreadSentCount,
}: {
  activeTab: "verdigim" | "gelen";
  sentCount: number;
  receivedCount: number;
  pendingReceivedCount: number;
  unreadSentCount: number;
}) {
  const tabClass = (tab: "verdigim" | "gelen") =>
    `rounded-t border px-4 py-2 text-[13px] font-semibold ${
      activeTab === tab
        ? "border-border border-b-card bg-card text-navy"
        : "border-transparent bg-[#f5f5f5] text-muted hover:text-navy"
    }`;

  return (
    <div className="mb-4 border-b border-border">
      <div className="flex flex-wrap gap-1">
        <Link href="/teklifler?tab=verdigim" className={tabClass("verdigim")}>
          Verdiğim Teklifler
          {unreadSentCount > 0 ? (
            <span className="ml-1 font-bold text-red-600">({unreadSentCount})</span>
          ) : sentCount > 0 ? (
            <span className="ml-1 font-bold text-foreground">({sentCount})</span>
          ) : null}
        </Link>
        <Link href="/teklifler?tab=gelen" className={tabClass("gelen")}>
          İlanlarıma Gelen
          {pendingReceivedCount > 0 ? (
            <span className="ml-1 font-bold text-red-600">({pendingReceivedCount})</span>
          ) : receivedCount > 0 ? (
            <span className="ml-1 font-bold text-foreground">({receivedCount})</span>
          ) : null}
        </Link>
      </div>
      <p className="mt-2 text-[12px] text-muted">
        {activeTab === "verdigim"
          ? "Başka kişilerin ilanlarına verdiğiniz teklifler."
          : "Kendi ilanlarınıza gelen teklifler — onaylayın veya reddedin."}
      </p>
    </div>
  );
}
