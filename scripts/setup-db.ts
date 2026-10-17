/**
 * Database setup script for Vercel builds.
 * - Applies schema using drizzle-kit push (idempotent)
 * - Upserts seed coins (idempotent, never duplicates)
 * - Never seeds sample posts in production
 * - Uses DATABASE_URL_UNPOOLED for migrations (required for DDL)
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { type NewCoin } from "../src/db/schema";

const initialCoins: NewCoin[] = [
  {
    slug: "render",
    name: "Render Network",
    ticker: "RENDER",
    description:
      "Render Network is a distributed GPU rendering platform that connects artists and studios with node operators to scale rendering work.",
    website: "https://rendernetwork.com",
    xHandle: "rendernetwork",
    discordUrl: "https://discord.gg/rendernetwork",
    telegramUrl: "https://t.me/rendernetwork",
    logoUrl: "/coins/render.svg",
  },
  {
    slug: "akash",
    name: "Akash Network",
    ticker: "AKT",
    description:
      "Akash Network is a decentralized cloud computing marketplace that enables users to buy and sell computing resources.",
    website: "https://akash.network",
    xHandle: "akashnet",
    discordUrl: "https://discord.gg/akash",
    telegramUrl: "https://t.me/AkashNW",
    logoUrl: "/coins/akash.svg",
  },
  {
    slug: "venice",
    name: "Venice AI",
    ticker: "VVV",
    description:
      "Venice AI is a decentralized, privacy-focused AI platform providing uncensored access to generative AI models.",
    website: "https://venice.ai",
    xHandle: "AskVenice",
    discordUrl: null,
    telegramUrl: null,
    logoUrl: "/coins/venice.svg",
  },
  {
    slug: "ionet",
    name: "io.net",
    ticker: "IO",
    description:
      "io.net is a decentralized computing network that aggregates GPU resources from data centers, crypto miners, and consumer hardware.",
    website: "https://io.net",
    xHandle: "ionet",
    discordUrl: "https://discord.gg/ionet",
    telegramUrl: "https://t.me/ionetofficial",
    logoUrl: "/coins/ionet.svg",
  },
  {
    slug: "bittensor",
    name: "Bittensor",
    ticker: "TAO",
    description:
      "Bittensor is a decentralized machine learning network that enables AI models to be trained and shared in a permissionless manner.",
    website: "https://bittensor.com",
    xHandle: "opentensor",
    discordUrl: "https://discord.gg/bittensor",
    telegramUrl: "https://t.me/taobittensor",
    logoUrl: "/coins/bittensor.svg",
  },
  {
    slug: "fetch",
    name: "Artificial Superintelligence Alliance",
    ticker: "FET",
    description:
      "The Artificial Superintelligence Alliance (formerly Fetch.ai) is building an open, permissionless network for AI agents.",
    website: "https://fetch.ai",
    xHandle: "Fetch_ai",
    discordUrl: "https://discord.gg/fetch-ai",
    telegramUrl: "https://t.me/fetch_ai",
    logoUrl: "/coins/fetch.svg",
  },
  {
    slug: "virtuals",
    name: "Virtuals Protocol",
    ticker: "VIRTUAL",
    description:
      "Virtuals Protocol enables the creation and co-ownership of AI agents that can operate across games and virtual worlds.",
    website: "https://virtuals.io",
    xHandle: "virtuals_io",
    discordUrl: "https://discord.gg/virtuals",
    telegramUrl: null,
    logoUrl: "/coins/virtuals.svg",
  },
  {
    slug: "near",
    name: "NEAR Protocol",
    ticker: "NEAR",
    description:
      "NEAR Protocol is a layer-1 blockchain with a focus on usability and scalability, supporting AI and Web3 applications.",
    website: "https://near.org",
    xHandle: "NEARProtocol",
    discordUrl: "https://discord.gg/near",
    telegramUrl: "https://t.me/cryptonear",
    logoUrl: "/coins/near.svg",
  },
  {
    slug: "aethir",
    name: "Aethir",
    ticker: "ATH",
    description:
      "Aethir is a decentralized cloud infrastructure network for gaming and AI, providing scalable GPU compute resources.",
    website: "https://aethir.com",
    xHandle: "AethirCloud",
    discordUrl: "https://discord.gg/aethir",
    telegramUrl: "https://t.me/aethircloud",
    logoUrl: "/coins/aethir.svg",
  },
];

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
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
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
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("✅ Schema ready\n");
  } catch (error) {
    console.error("❌ Schema creation failed:", error);
    throw error;
  }

  console.log("📦 Upserting seed coins...");
  
  try {
    for (const coin of initialCoins) {
      await db.execute(sql`
        INSERT INTO coins (slug, name, ticker, description, website, x_handle, discord_url, telegram_url, logo_url)
        VALUES (
          ${coin.slug},
          ${coin.name},
          ${coin.ticker},
          ${coin.description},
          ${coin.website},
          ${coin.xHandle},
          ${coin.discordUrl},
          ${coin.telegramUrl},
          ${coin.logoUrl}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          ticker = EXCLUDED.ticker,
          description = EXCLUDED.description,
          website = EXCLUDED.website,
          x_handle = EXCLUDED.x_handle,
          discord_url = EXCLUDED.discord_url,
          telegram_url = EXCLUDED.telegram_url,
          logo_url = EXCLUDED.logo_url,
          updated_at = NOW()
      `);
    }
    console.log(`✅ Upserted ${initialCoins.length} coins\n`);
  } catch (error) {
    console.error("❌ Coin upsert failed:", error);
    throw error;
  }

  console.log("✨ Database setup complete!");
}

setupDatabase().catch((error) => {
  console.error("❌ Database setup failed:", error);
  process.exit(1);
});
