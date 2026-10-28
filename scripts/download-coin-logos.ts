/**
 * Download coin logos from CoinGecko and save them to public/coin-logos/
 * Usage: npx tsx scripts/download-coin-logos.ts
 */

import * as fs from "fs";
import * as path from "path";
import { seedCoins } from "./seed-data";

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";
const OUTPUT_DIR = path.join(process.cwd(), "public", "coin-logos");
const DELAY_MS = 1500; // Rate limit: ~30 requests per minute for free tier

interface CoinGeckoResponse {
  image?: {
    large?: string;
    small?: string;
    thumb?: string;
  };
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadImage(url: string, filepath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  Failed to download image: ${response.status}`);
      return false;
    }
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`  Error downloading image:`, error);
    return false;
  }
}

async function fetchCoinImage(coingeckoId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${coingeckoId}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log(`  Rate limited, waiting 60s...`);
        await sleep(60000);
        return fetchCoinImage(coingeckoId);
      }
      console.error(`  API error for ${coingeckoId}: ${response.status}`);
      return null;
    }
    
    const data: CoinGeckoResponse = await response.json();
    return data.image?.large || data.image?.small || null;
  } catch (error) {
    console.error(`  Error fetching ${coingeckoId}:`, error);
    return null;
  }
}

async function main() {
  console.log("🖼️  Downloading coin logos from CoinGecko...\n");
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const failed: string[] = [];
  const skipped: string[] = [];
  let downloaded = 0;

  for (const coin of seedCoins) {
    const outputPath = path.join(OUTPUT_DIR, `${coin.slug}.png`);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✓ ${coin.slug} (already exists)`);
      continue;
    }

    if (!coin.coingeckoId) {
      console.log(`⊘ ${coin.slug} (no coingeckoId)`);
      skipped.push(coin.slug);
      continue;
    }

    console.log(`↓ ${coin.slug} (${coin.coingeckoId})...`);
    
    const imageUrl = await fetchCoinImage(coin.coingeckoId);
    
    if (!imageUrl) {
      console.log(`  ✗ No image URL found`);
      failed.push(coin.slug);
      await sleep(DELAY_MS);
      continue;
    }

    const success = await downloadImage(imageUrl, outputPath);
    
    if (success) {
      console.log(`  ✓ Saved to ${coin.slug}.png`);
      downloaded++;
    } else {
      failed.push(coin.slug);
    }
    
    await sleep(DELAY_MS);
  }

  console.log("\n📊 Summary:");
  console.log(`   Downloaded: ${downloaded}`);
  console.log(`   Skipped (no coingeckoId): ${skipped.length}`);
  console.log(`   Failed: ${failed.length}`);
  
  if (skipped.length > 0) {
    console.log(`\n⊘ Skipped coins (no coingeckoId):`);
    skipped.forEach((slug) => console.log(`   - ${slug}`));
  }
  
  if (failed.length > 0) {
    console.log(`\n✗ Failed coins:`);
    failed.forEach((slug) => console.log(`   - ${slug}`));
  }
}

main().catch(console.error);
