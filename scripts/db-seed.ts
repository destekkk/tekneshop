import { config } from "dotenv";
import { resolve } from "node:path";
import { seedDefaultAds } from "../lib/ads-store";
import { defaultSiteConfig, saveSiteConfig } from "../lib/admin/settings";
import { seedListingsFromStatic } from "../lib/listings-store";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL tanımlı değil.");
    process.exit(1);
  }
  await seedListingsFromStatic();
  await seedDefaultAds();
  await saveSiteConfig(defaultSiteConfig);
  console.log("✓ İlanlar, reklamlar ve site ayarları yüklendi.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
