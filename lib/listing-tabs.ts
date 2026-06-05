export type ListingTab = "tumu" | "bekleyen" | "onayli" | "reddedilen";

export function parseListingTab(tab?: string): ListingTab {
  if (tab === "bekleyen" || tab === "onayli" || tab === "reddedilen") return tab;
  return "tumu";
}
