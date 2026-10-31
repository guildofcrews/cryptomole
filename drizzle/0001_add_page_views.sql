-- Migration: Add page_views table for first-party analytics
-- Run with: npm run db:migrate (requires DATABASE_URL)

-- Device type enum
DO $$ BEGIN
  CREATE TYPE "device_type" AS ENUM('desktop', 'mobile', 'tablet');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Page views table
-- visitor_hash is a daily-salted SHA-256 of IP + UA (raw IPs are never stored)
CREATE TABLE IF NOT EXISTS "page_views" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "view_date" date NOT NULL,
  "path" text NOT NULL,
  "visitor_hash" varchar(64) NOT NULL,
  "referrer_host" text,
  "device_type" "device_type" DEFAULT 'desktop' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Index for efficient stats queries
CREATE INDEX IF NOT EXISTS "page_views_view_date_idx" ON "page_views" ("view_date");
CREATE INDEX IF NOT EXISTS "page_views_path_idx" ON "page_views" ("path");
CREATE INDEX IF NOT EXISTS "page_views_visitor_hash_idx" ON "page_views" ("visitor_hash");
