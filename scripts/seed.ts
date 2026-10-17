import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import { coins, posts, type NewCoin, type NewPost } from "../src/db/schema";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(connectionString);
const db = drizzle(sql);

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
    xHandle: "akabornetwork",
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
    xHandle: "venicedotai",
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
    xHandle: "ionaborofficial",
    discordUrl: "https://discord.gg/ionet",
    telegramUrl: "https://t.me/iabornetofficial",
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
    xHandle: "ASaborAlliance",
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
    xHandle: "virtaborprotocol",
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
    xHandle: "nearprotocol",
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
    xHandle: "aaborcloud",
    discordUrl: "https://discord.gg/aethir",
    telegramUrl: "https://t.me/aethircloud",
    logoUrl: "/coins/aethir.svg",
  },
];

const samplePosts: Omit<NewPost, "coinId">[] = [
  {
    title: "Render Network Announces Major GPU Provider Partnership",
    summary:
      "Render Network has partnered with a leading data center to add over 10,000 GPUs to the network.",
    body: "We are excited to announce a major partnership that will significantly expand Render Network's compute capacity. This partnership will add over 10,000 high-performance GPUs to our distributed rendering network, enabling faster render times and greater accessibility for artists worldwide.",
    sourceType: "x",
    sourceUrl: "https://x.com/rendernetwork/status/example",
    publishedAt: new Date("2024-01-15"),
    status: "approved",
  },
  {
    title: "Akash Network Mainnet Upgrade v0.28.0 Complete",
    summary:
      "The latest mainnet upgrade brings improved performance and new features to the Akash Network.",
    body: "The Akash Network mainnet has been successfully upgraded to version 0.28.0. This upgrade includes significant performance improvements, enhanced provider tooling, and new features for deployers. Thank you to all validators who participated in the upgrade process.",
    sourceType: "announcement",
    sourceUrl: "https://x.com/akashnetwork/status/example",
    publishedAt: new Date("2024-01-14"),
    status: "approved",
  },
  {
    title: "Bittensor Subnet 8 Launches for Decentralized Translation",
    summary:
      "A new subnet focused on AI-powered translation services has launched on Bittensor.",
    body: "Subnet 8 is now live on the Bittensor network, focusing on decentralized translation services. Miners compete to provide the highest quality translations across multiple language pairs, earning TAO rewards based on translation accuracy and speed.",
    sourceType: "blog",
    sourceUrl: "https://bittensor.com/blog/subnet-8-launch",
    publishedAt: new Date("2024-01-13"),
    status: "approved",
  },
  {
    title: "NEAR Protocol Foundation Announces AI Grants Program",
    summary:
      "NEAR Foundation launches $10M grants program for AI development on NEAR.",
    body: "The NEAR Foundation is excited to announce a new $10 million grants program dedicated to supporting AI development on the NEAR ecosystem. Projects building AI agents, machine learning tools, and decentralized AI infrastructure are encouraged to apply.",
    sourceType: "call",
    sourceUrl: "https://near.org/blog/ai-grants",
    publishedAt: new Date("2024-01-12"),
    status: "approved",
  },
];

async function seed() {
  console.log("🌱 Seeding database...\n");

  const isProduction = process.env.NODE_ENV === "production";

  console.log("📦 Inserting coins...");
  const insertedCoins = await db
    .insert(coins)
    .values(initialCoins)
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Inserted ${insertedCoins.length} coins\n`);

  if (!isProduction && insertedCoins.length > 0) {
    console.log("📝 Inserting sample posts (dev only)...");

    const coinMap = new Map(insertedCoins.map((c) => [c.slug, c.id]));

    const postsToInsert: NewPost[] = [
      { ...samplePosts[0], coinId: coinMap.get("render")! },
      { ...samplePosts[1], coinId: coinMap.get("akash")! },
      { ...samplePosts[2], coinId: coinMap.get("bittensor")! },
      { ...samplePosts[3], coinId: coinMap.get("near")! },
    ];

    const insertedPosts = await db
      .insert(posts)
      .values(postsToInsert)
      .onConflictDoNothing()
      .returning();

    console.log(
      `✅ Inserted ${insertedPosts.length} sample posts (DEV DATA ONLY)\n`
    );
  } else if (isProduction) {
    console.log("⏭️  Skipping sample posts in production\n");
  }

  console.log("✨ Seeding complete!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
