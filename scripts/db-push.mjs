import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

config({ path: resolve(root, ".env.local") });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL tanımlı değil. .env.local dosyasına ekleyin.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const statements = [
  `DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('pending', 'approved', 'rejected', 'archived');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN
    CREATE TYPE listing_type AS ENUM ('boat', 'product', 'service');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN
    CREATE TYPE ad_placement AS ENUM ('top_banner', 'inline_list');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN
    CREATE TYPE nav_type AS ENUM ('tekne', 'magaza', 'custom');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL,
    label TEXT NOT NULL,
    parent_id INTEGER,
    href TEXT,
    nav_type nav_type NOT NULL DEFAULT 'magaza',
    sort_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    type listing_type NOT NULL DEFAULT 'boat',
    title TEXT NOT NULL,
    description TEXT,
    status listing_status NOT NULL DEFAULT 'pending',
    condition TEXT,
    boat_type TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    year INTEGER,
    length_m TEXT,
    location TEXT,
    engine TEXT,
    badge TEXT,
    image TEXT NOT NULL DEFAULT '/boats/placeholder.jpg',
    images JSONB DEFAULT '[]',
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    rejection_reason TEXT,
    fee_paid BOOLEAN NOT NULL DEFAULT false,
    fee_amount INTEGER NOT NULL DEFAULT 0,
    source TEXT DEFAULT 'manual',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS ads (
    id SERIAL PRIMARY KEY,
    placement ad_placement NOT NULL,
    slot INTEGER,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT,
    link_url TEXT NOT NULL DEFAULT '/ilan-ver',
    active BOOLEAN NOT NULL DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `DO $$ BEGIN
    CREATE TYPE accounting_type AS ENUM ('income', 'expense');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN
    CREATE TYPE accounting_category AS ENUM (
      'listing_fee', 'featured_fee', 'package_sale', 'ad_revenue',
      'refund', 'bank_fee', 'tax', 'salary', 'other'
    );
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `DO $$ BEGIN
    CREATE TYPE accounting_status AS ENUM ('pending', 'completed', 'cancelled');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`,
  `CREATE TABLE IF NOT EXISTS accounting_entries (
    id SERIAL PRIMARY KEY,
    type accounting_type NOT NULL,
    category accounting_category NOT NULL DEFAULT 'other',
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    description TEXT NOT NULL,
    reference TEXT,
    customer_name TEXT,
    customer_email TEXT,
    payment_method TEXT,
    status accounting_status NOT NULL DEFAULT 'completed',
    entry_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `ALTER TABLE listings ADD COLUMN IF NOT EXISTS admin_notes TEXT`,
  `ALTER TABLE listings ADD COLUMN IF NOT EXISTS listing_number INTEGER UNIQUE`,
  `ALTER TABLE listings ADD COLUMN IF NOT EXISTS show_contact_phone BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE listings ADD COLUMN IF NOT EXISTS brand TEXT`,
  `ALTER TABLE listings ADD COLUMN IF NOT EXISTS model TEXT`,
  `ALTER TABLE listings ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'TRY'`,
  `ALTER TABLE listing_inquiries ADD COLUMN IF NOT EXISTS reported BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE listing_inquiries ADD COLUMN IF NOT EXISTS report_reason TEXT`,
  `ALTER TABLE listing_inquiries ADD COLUMN IF NOT EXISTS reported_at TIMESTAMPTZ`,
  `ALTER TABLE listing_inquiries ADD COLUMN IF NOT EXISTS reported_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL`,
  `ALTER TABLE listing_inquiries ADD COLUMN IF NOT EXISTS buyer_read BOOLEAN NOT NULL DEFAULT true`,
  `CREATE TABLE IF NOT EXISTS listing_inquiry_messages (
    id SERIAL PRIMARY KEY,
    inquiry_id INTEGER NOT NULL REFERENCES listing_inquiries(id) ON DELETE CASCADE,
    author_role TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `ALTER TABLE listing_offers ADD COLUMN IF NOT EXISTS buyer_read BOOLEAN NOT NULL DEFAULT true`,
  `ALTER TABLE listing_offers ADD COLUMN IF NOT EXISTS counter_amount INTEGER`,
  `ALTER TABLE listing_offers ADD COLUMN IF NOT EXISTS counter_message TEXT`,
  `ALTER TABLE listing_offers ADD COLUMN IF NOT EXISTS counter_at TIMESTAMPTZ`,
  `CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    link_url TEXT,
    link_label TEXT,
    tone TEXT NOT NULL DEFAULT 'info',
    active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    admin_email TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS listing_sellers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    city TEXT,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    tc_no TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS listing_inquiries (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    listing_title TEXT,
    sender_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_phone TEXT,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS listing_offers (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS email_subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    source TEXT NOT NULL DEFAULT 'manual',
    subscribed BOOLEAN NOT NULL DEFAULT true,
    unsubscribe_token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS email_campaigns (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    body_text TEXT,
    recipient_count INTEGER NOT NULL DEFAULT 0,
    sent_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft',
    admin_email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ
  )`,
  `CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    listing_slug TEXT,
    product_slug TEXT,
    product_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS user_favorites_user_listing_idx ON user_favorites (user_id, listing_id) WHERE listing_id IS NOT NULL`,
  `CREATE UNIQUE INDEX IF NOT EXISTS user_favorites_user_product_idx ON user_favorites (user_id, product_slug) WHERE product_slug IS NOT NULL`,
  `CREATE TABLE IF NOT EXISTS listing_price_history (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    price INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT NOT NULL DEFAULT 'create'
  )`,
  `CREATE TABLE IF NOT EXISTS favorite_price_alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    listing_title TEXT,
    listing_slug TEXT,
    old_price INTEGER NOT NULL,
    new_price INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`,
];

for (const stmt of statements) {
  await sql.query(stmt);
  const label = stmt.includes("CREATE TYPE") || stmt.includes("DO $$")
    ? "enum types"
    : stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || "table";
  console.log("✓", label);
}

console.log("\nVeritabanı tabloları hazır.");

const magazaOrder = [
  "tekne-malzemeleri",
  "aydinlatma",
  "boya-bakim",
  "elektrik",
  "elektronik",
  "spor-outdoor",
  "sisme-bot",
  "motor-aksami",
  "karavan",
];

for (const [i, slug] of magazaOrder.entries()) {
  await sql`
    UPDATE categories
    SET sort_order = ${i + 1}
    WHERE slug = ${slug} AND parent_id IS NULL
  `;
}
console.log("✓ kategori sırası güncellendi");

const listingRows = await sql`SELECT id, listing_number FROM listings ORDER BY id`;
const usedNumbers = new Set();
for (const row of listingRows) {
  const n = row.listing_number;
  if (n >= 10000 && n <= 99999 && !usedNumbers.has(n)) {
    usedNumbers.add(n);
    continue;
  }
  let candidate;
  do {
    candidate = 10000 + Math.floor(Math.random() * 90000);
  } while (usedNumbers.has(candidate));
  usedNumbers.add(candidate);
  await sql`UPDATE listings SET listing_number = ${candidate} WHERE id = ${row.id}`;
}
if (listingRows.length > 0) {
  console.log("✓ ilan numaraları (5 hane) güncellendi");
}

const tekneMalzSubs = [
  ["bas-pervanesi", "Baş Pervanesi", null],
  ["boya-bakim", "Boya / Bakım", "/magaza/boya-bakim"],
  ["duzen-kumanda", "Dümen / Kumanda", null],
  ["demirleme", "Demirleme / Rıhtım", null],
  ["elektrik", "Elektrik", "/magaza/elektrik"],
  ["guvenlik", "Güvenlik", null],
  ["guverte", "Güverte", null],
  ["havalandirma", "Havalandırma", null],
  ["kabin", "Kabin", null],
  ["navigasyon", "Navigasyon", null],
  ["tuvalet-pis-su", "Atık Su / Tuvalet", null],
  ["sintine-pompalari", "Sintine Pompaları", null],
  ["tatli-su", "Tatlı Su", null],
  ["usturmaça", "Usturmaça ve Ekipmanı", null],
  ["yakit-sistemi", "Yakıt Sistemi", null],
  ["hidrofor-pompalari", "Hidrofor Pompaları", null],
  ["motor-aksami", "Motor Aksamı", "/magaza/motor-aksami"],
  ["mutfak", "Mutfak Malzemeleri", null],
  ["yelken", "Yelken", null],
  ["aydinlatma", "Aydınlatma", "/magaza/aydinlatma"],
];

const tekneMalzRows =
  await sql`SELECT id FROM categories WHERE slug = 'tekne-malzemeleri' AND parent_id IS NULL LIMIT 1`;
if (tekneMalzRows.length > 0) {
  const parentId = tekneMalzRows[0].id;
  for (const [i, [slug, label, href]] of tekneMalzSubs.entries()) {
    const existing = await sql`
      SELECT id FROM categories WHERE parent_id = ${parentId} AND slug = ${slug} LIMIT 1
    `;
    if (existing.length > 0) {
      await sql`
        UPDATE categories
        SET label = ${label}, sort_order = ${i}, href = ${href}, active = true, updated_at = NOW()
        WHERE id = ${existing[0].id}
      `;
    } else {
      await sql`
        INSERT INTO categories (slug, label, parent_id, nav_type, sort_order, href, active)
        VALUES (${slug}, ${label}, ${parentId}, 'magaza', ${i}, ${href}, true)
      `;
    }
  }
  console.log("✓ tekne malzemeleri alt kategorileri güncellendi");
}

const elektronikSubs = [
  ["balik-bulucular", "Balık Bulucular"],
  ["marin-muzik-sistemleri", "Marin Müzik Sistemleri"],
  ["marin-hoparlorler", "Marin Hoparlörler"],
  ["marin-telsizler", "Marin Telsizler"],
  ["anten", "Anten"],
  ["dynaplate", "Dynaplate"],
  ["derinlik-gostergesi", "Derinlik Göstergesi"],
  ["marin-amfiler", "Marin Amfiler"],
  ["marin-kameralar", "Marin Kameralar"],
  ["oto-pilot", "Oto Pilot"],
];

const elektronikRows =
  await sql`SELECT id FROM categories WHERE slug = 'elektronik' AND parent_id IS NULL LIMIT 1`;
if (elektronikRows.length > 0) {
  const parentId = elektronikRows[0].id;
  for (const [i, [slug, label]] of elektronikSubs.entries()) {
    const existing = await sql`
      SELECT id FROM categories WHERE parent_id = ${parentId} AND slug = ${slug} LIMIT 1
    `;
    if (existing.length > 0) {
      await sql`
        UPDATE categories
        SET label = ${label}, sort_order = ${i}, active = true, updated_at = NOW()
        WHERE id = ${existing[0].id}
      `;
    } else {
      await sql`
        INSERT INTO categories (slug, label, parent_id, nav_type, sort_order, active)
        VALUES (${slug}, ${label}, ${parentId}, 'magaza', ${i}, true)
      `;
    }
  }
  console.log("✓ elektronik alt kategorileri güncellendi");
}
