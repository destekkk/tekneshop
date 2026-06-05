import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const listingStatusEnum = pgEnum("listing_status", [
  "pending",
  "approved",
  "rejected",
  "archived",
]);

export const listingTypeEnum = pgEnum("listing_type", [
  "boat",
  "product",
  "service",
]);

export const adPlacementEnum = pgEnum("ad_placement", [
  "top_banner",
  "inline_list",
]);

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  type: listingTypeEnum("type").notNull().default("boat"),
  title: text("title").notNull(),
  description: text("description"),
  status: listingStatusEnum("status").notNull().default("pending"),
  condition: text("condition"),
  boatType: text("boat_type"),
  price: integer("price").notNull().default(0),
  year: integer("year"),
  lengthM: text("length_m"),
  location: text("location"),
  engine: text("engine"),
  badge: text("badge"),
  image: text("image").notNull().default("/boats/placeholder.jpg"),
  images: jsonb("images").$type<string[]>().default([]),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  isFeatured: boolean("is_featured").notNull().default(false),
  rejectionReason: text("rejection_reason"),
  feePaid: boolean("fee_paid").notNull().default(false),
  feeAmount: integer("fee_amount").notNull().default(0),
  source: text("source").default("manual"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  placement: adPlacementEnum("placement").notNull(),
  slot: integer("slot"),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url"),
  linkUrl: text("link_url").notNull().default("/ilan-ver"),
  active: boolean("active").notNull().default(true),
  priority: integer("priority").notNull().default(0),
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const navTypeEnum = pgEnum("nav_type", ["tekne", "magaza", "custom"]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  label: text("label").notNull(),
  parentId: integer("parent_id"),
  href: text("href"),
  navType: navTypeEnum("nav_type").notNull().default("magaza"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const accountingTypeEnum = pgEnum("accounting_type", ["income", "expense"]);

export const accountingCategoryEnum = pgEnum("accounting_category", [
  "listing_fee",
  "featured_fee",
  "package_sale",
  "ad_revenue",
  "refund",
  "bank_fee",
  "tax",
  "salary",
  "other",
]);

export const accountingStatusEnum = pgEnum("accounting_status", [
  "pending",
  "completed",
  "cancelled",
]);

export const accountingEntries = pgTable("accounting_entries", {
  id: serial("id").primaryKey(),
  type: accountingTypeEnum("type").notNull(),
  category: accountingCategoryEnum("category").notNull().default("other"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("TRY"),
  description: text("description").notNull(),
  reference: text("reference"),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  paymentMethod: text("payment_method"),
  status: accountingStatusEnum("status").notNull().default("completed"),
  entryDate: timestamp("entry_date", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id"),
  adminEmail: text("admin_email"),
  details: jsonb("details").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type Ad = typeof ads.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type AccountingEntry = typeof accountingEntries.$inferSelect;
export type NewAccountingEntry = typeof accountingEntries.$inferInsert;
