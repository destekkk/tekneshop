import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/boats");

/** Her slug için birden fazla kaynak — ilki başarısız olursa sonrakine geç */
const BOAT_SOURCES = {
  "azimut-55-fly-sifir": [
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/163236/luxury-yacht-boat-marina-163236.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "beneteau-oceanis-46": [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "quicksilver-activ-675": [
    "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/675764/pexels-photo-675764.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "zodiac-milpro-580": [
    "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "sea-doo-gtx-170": [
    "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/1631139/pexels-photo-1631139.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "lagoon-42-katamaran": [
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/273886/pexels-photo-273886.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "prestige-460-kiralik": [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "bavaria-cruiser-37": [
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/360142/pexels-photo-360142.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "princess-v40-2018": [
    "https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80",
  ],
  "fairline-targa-45-gt": [
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80",
  ],
  "jeanneau-sun-odyssey-410": [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
  ],
  "hanse-458-2021": [
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "bali-4-1-katamaran": [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?auto=format&fit=crop&w=900&q=80",
  ],
  "fountaine-pajot-lucia-40": [
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/273886/pexels-photo-273886.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "monterey-295-sport-yacht": [
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80",
  ],
  "boston-whaler-270-dauntless": [
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/675764/pexels-photo-675764.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "saxdor-320-gto": [
    "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80",
  ],
  "capelli-tempest-900-wa": [
    "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "joker-boat-clubman-24": [
    "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=900&q=80",
  ],
  "yamaha-fx-cruiser-svho": [
    "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/1631139/pexels-photo-1631139.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "sea-doo-rxt-x-300": [
    "https://images.pexels.com/photos/1631139/pexels-photo-1631139.jpeg?auto=compress&w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80",
  ],
  "gulet-24m-kiralik-bodrum": [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/360142/pexels-photo-360142.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "motoryat-18m-kiralik-gocek": [
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/163236/luxury-yacht-boat-marina-163236.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "custom-line-52-trawler": [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "dufour-390-grand-large": [
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "greenline-39-hybrid": [
    "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80",
    "https://images.pexels.com/photos/675764/pexels-photo-675764.jpeg?auto=compress&w=800&h=600&fit=crop",
  ],
  "cranchi-z35": [
    "https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
  ],
  "sunseeker-predator-57": [
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80",
  ],
  "axopar-28-cabin": [
    "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80",
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
