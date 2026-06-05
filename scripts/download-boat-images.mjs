import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/boats");

/** Marina / rıhtım / liman bağlamında deniz aracı görselleri */
const BOAT_SOURCES = {
  "azimut-55-fly-sifir": [
    "https://loremflickr.com/800/600/yacht,marina,harbour/all",
    "https://images.pexels.com/photos/163236/luxury-yacht-boat-marina-163236.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "prestige-460-kiralik": [
    "https://loremflickr.com/800/600/yacht,marina,dock/all",
    "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "quicksilver-activ-675": [
    "https://loremflickr.com/800/600/motorboat,marina,pier/all",
    "https://images.pexels.com/photos/675764/pexels-photo-675764.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "beneteau-oceanis-46": [
    "https://loremflickr.com/800/600/sailboat,marina,harbour/all",
    "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "bavaria-cruiser-37": [
    "https://loremflickr.com/800/600/sailing,yacht,marina/all",
    "https://images.pexels.com/photos/360142/pexels-photo-360142.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "lagoon-42-katamaran": [
    "https://loremflickr.com/800/600/catamaran,marina,dock/all",
    "https://images.pexels.com/photos/273886/pexels-photo-273886.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "zodiac-milpro-580": [
    "https://loremflickr.com/800/600/boat,marina,harbor/all",
    "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "sea-doo-gtx-170": [
    "https://loremflickr.com/800/600/jetski,marina,waterfront/all",
    "https://images.pexels.com/photos/1631139/pexels-photo-1631139.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
};

async function download(slug, url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; TekneShop/1.0)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  if (!type.includes("image")) throw new Error(`not image: ${type}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 3000) throw new Error(`too small (${buf.length})`);
  fs.writeFileSync(path.join(outDir, `${slug}.jpg`), buf);
  return buf.length;
}

fs.mkdirSync(outDir, { recursive: true });

for (const [slug, urls] of Object.entries(BOAT_SOURCES)) {
  let ok = false;
  for (const url of urls) {
    try {
      const n = await download(slug, url);
      console.log(`OK  ${slug} (${n} bytes)`);
      ok = true;
      break;
    } catch (e) {
      console.log(`  skip ${slug}: ${e.message}`);
    }
  }
  if (!ok) console.log(`FAIL ${slug}`);
}
