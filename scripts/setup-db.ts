/**
 * Database setup script for Vercel builds.
 * - Applies schema using raw SQL (idempotent)
 * - Upserts 70 coins, 13 categories, and their relationships
 * - Never deletes existing posts
 * - Uses DATABASE_URL_UNPOOLED for migrations (required for DDL)
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { seedCategories, seedCoins } from "./seed-data";

async function setupDatabase() {
  console.log("🔧 Setting up database...\n");

  const unpooledUrl = process.env.DATABASE_URL_UNPOOLED;
  const pooledUrl = process.env.DATABASE_URL;

  if (!unpooledUrl && !pooledUrl) {
    console.log("⚠️  No DATABASE_URL or DATABASE_URL_UNPOOLED set, skipping database setup");
    console.log("   (This is expected for builds without database access)\n");
    return;
  }

  const connectionString = unpooledUrl || pooledUrl;
  console.log(`📡 Using ${unpooledUrl ? "unpooled" : "pooled"} connection for setup\n`);

  const sqlClient = neon(connectionString!);
  const db = drizzle(sqlClient);

  console.log("📋 Creating schema (if not exists)...");

  try {
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE post_status AS ENUM ('draft', 'approved', 'rejected');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE source_type AS ENUM ('x', 'inbox', 'blog', 'call', 'announcement', 'other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE coin_class AS ENUM ('project', 'macro', 'macro+project', 'issuer');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS coins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        ticker TEXT NOT NULL,
        description TEXT,
        website TEXT,
        x_handle TEXT,
        discord_url TEXT,
        telegram_url TEXT,
        logo_url TEXT,
        coingecko_id TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      ALTER TABLE coins ADD COLUMN IF NOT EXISTS coingecko_id TEXT;
    `);

    await db.execute(sql`
      ALTER TABLE coins ADD COLUMN IF NOT EXISTS coin_class coin_class DEFAULT 'project';
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS subcategories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS coin_categories (
        coin_id UUID NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
        category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (coin_id, category_id)
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS coin_subcategories (
        coin_id UUID NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
        subcategory_id UUID NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
        PRIMARY KEY (coin_id, subcategory_id)
      );
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        coin_id UUID NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        summary TEXT,
        body TEXT,
        source_type source_type NOT NULL DEFAULT 'other',
        source_url TEXT,
        published_at TIMESTAMP,
        status post_status NOT NULL DEFAULT 'draft',
        topics TEXT[],
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await db.execute(sql`
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS topics TEXT[];
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS post_coins (
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        coin_id UUID NOT NULL REFERENCES coins(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, coin_id)
      );
    `);

    console.log("✅ Schema ready\n");
  } catch (error) {
    console.error("❌ Schema creation failed:", error);
    throw error;
  }

  console.log("📦 Upserting categories and subcategories...");

  const categoryIdMap = new Map<string, string>();
  const subcategoryIdMap = new Map<string, string>();

  try {
    for (const category of seedCategories) {
      const result = await db.execute(sql`
        INSERT INTO categories (slug, name, description)
        VALUES (${category.slug}, ${category.name}, ${category.description})
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          updated_at = NOW()
        RETURNING id
      `);
      const id = (result.rows[0] as { id: string }).id;
      categoryIdMap.set(category.slug, id);

      for (const sub of category.subcategories) {
        const subResult = await db.execute(sql`
          INSERT INTO subcategories (slug, name, category_id)
          VALUES (${sub.slug}, ${sub.name}, ${id}::uuid)
          ON CONFLICT (slug) DO UPDATE SET
            name = EXCLUDED.name,
            category_id = EXCLUDED.category_id,
            updated_at = NOW()
          RETURNING id
        `);
        const subId = (subResult.rows[0] as { id: string }).id;
        subcategoryIdMap.set(sub.slug, subId);
      }
    }
    console.log(`✅ Upserted ${seedCategories.length} categories\n`);
  } catch (error) {
    console.error("❌ Category upsert failed:", error);
    throw error;
  }

  console.log("📦 Upserting coins...");

  const coinIdMap = new Map<string, string>();

  try {
    for (const coin of seedCoins) {
      const result = await db.execute(sql`
        INSERT INTO coins (slug, name, ticker, description, website, x_handle, coingecko_id, coin_class)
        VALUES (
          ${coin.slug},
          ${coin.name},
          ${coin.ticker},
          ${coin.description || null},
          ${coin.website},
          ${coin.xHandle},
          ${coin.coingeckoId},
          ${coin.coinClass}::coin_class
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          ticker = EXCLUDED.ticker,
          description = COALESCE(EXCLUDED.description, coins.description),
          website = COALESCE(EXCLUDED.website, coins.website),
          x_handle = COALESCE(EXCLUDED.x_handle, coins.x_handle),
          coingecko_id = COALESCE(EXCLUDED.coingecko_id, coins.coingecko_id),
          coin_class = EXCLUDED.coin_class,
          updated_at = NOW()
        RETURNING id
      `);
      const id = (result.rows[0] as { id: string }).id;
      coinIdMap.set(coin.slug, id);
    }
    console.log(`✅ Upserted ${seedCoins.length} coins\n`);
  } catch (error) {
    console.error("❌ Coin upsert failed:", error);
    throw error;
  }

  console.log("🔗 Linking coins to categories...");

  try {
    for (const coin of seedCoins) {
      const coinId = coinIdMap.get(coin.slug);
      if (!coinId) continue;

      for (const catSlug of coin.categories) {
        const catId = categoryIdMap.get(catSlug);
        if (!catId) continue;

        await db.execute(sql`
          INSERT INTO coin_categories (coin_id, category_id)
          VALUES (${coinId}::uuid, ${catId}::uuid)
          ON CONFLICT DO NOTHING
        `);
      }

      for (const subSlug of coin.subcategories) {
        const subId = subcategoryIdMap.get(subSlug);
        if (!subId) continue;

        await db.execute(sql`
          INSERT INTO coin_subcategories (coin_id, subcategory_id)
          VALUES (${coinId}::uuid, ${subId}::uuid)
          ON CONFLICT DO NOTHING
        `);
      }
    }
    console.log("✅ Coin-category links updated\n");
  } catch (error) {
    console.error("❌ Coin-category linking failed:", error);
    throw error;
  }

  console.log("✨ Database setup complete!");
}

setupDatabase().catch((error) => {
  console.error("❌ Database setup failed:", error);
  process.exit(1);
});
