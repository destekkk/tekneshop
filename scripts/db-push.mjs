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
  `UPDATE listings SET listing_number = 1000000 + id WHERE listing_number IS NULL`,
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
];

for (const stmt of statements) {
  await sql.query(stmt);
  const label = stmt.includes("CREATE TYPE") || stmt.includes("DO $$")
    ? "enum types"
    : stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || "table";
  console.log("✓", label);
}

console.log("\nVeritabanı tabloları hazır.");
