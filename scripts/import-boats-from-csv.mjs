/**
 * CSV şablonundan lib/boats-import.json üretir.
 * Kullanım: node scripts/import-boats-from-csv.mjs templates/doldurulmus-ilanlar.csv
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const VALID_CONDITION = new Set(["sifir", "ikinci-el", "kiralik"]);
const VALID_TYPE = new Set([
  "motoryat",
  "yelkenli",
  "sisme-bot",
  "jet-ski",
  "katamaran",
]);

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCsv(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(";");
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(";");
    if (cols.every((c) => !c.trim())) continue;
    const row = {};
    header.forEach((key, idx) => {
      row[key.trim()] = (cols[idx] ?? "").trim();
    });
    if (!row.baslik) continue;
    rows.push(row);
  }
  return rows;
}

function toNumber(value, field) {
  const n = Number(String(value).replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n)) throw new Error(`${field} geçersiz: ${value}`);
  return n;
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Kullanım: node scripts/import-boats-from-csv.mjs <csv-dosyasi>");
  process.exit(1);
}

const raw = readFileSync(resolve(root, csvPath), "utf8");
const parsed = parseCsv(raw);
const listings = [];
const errors = [];

for (const [i, row] of parsed.entries()) {
  const line = i + 2;
  try {
    if (!row.baslik || !row.durum || !row.tekne_tipi) {
      throw new Error("baslik, durum ve tekne_tipi zorunlu");
    }
    if (!VALID_CONDITION.has(row.durum)) {
      throw new Error(`durum: ${row.durum}`);
    }
    if (!VALID_TYPE.has(row.tekne_tipi)) {
      throw new Error(`tekne_tipi: ${row.tekne_tipi}`);
    }

    const slug = row.slug || slugify(row.baslik);
    const image = row.foto_url || `/boats/${slug}.jpg`;

    listings.push({
      slug,
      title: row.baslik,
      image,
      condition: row.durum,
      boatType: row.tekne_tipi,
      price: toNumber(row.fiyat_tl, "fiyat_tl"),
      year: toNumber(row.yil, "yil"),
      lengthM: toNumber(row.uzunluk_m, "uzunluk_m"),
      location: row.konum,
      ...(row.motor ? { engine: row.motor } : {}),
      ...(row.rozet ? { badge: row.rozet } : {}),
    });
  } catch (e) {
    errors.push(`Satır ${line}: ${e.message}`);
  }
}

if (errors.length) {
  console.error("Hatalar:\n" + errors.join("\n"));
  process.exit(1);
}

const out = resolve(root, "lib", "boats-import.json");
writeFileSync(out, JSON.stringify(listings, null, 2) + "\n", "utf8");
console.log(`✓ ${listings.length} ilan → ${out}`);
