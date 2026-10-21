import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { posts, coins, postCoins } from "@/db/schema";
import { eq, inArray, and, desc } from "drizzle-orm";

export interface Headline {
  id: string;
  title: string;
  sourceType: string;
  publishedAt: string | null;
  coinSlug: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slugs = searchParams.get("slugs");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 5;

  if (!slugs) {
    return NextResponse.json({ error: "slugs parameter required" }, { status: 400 });
  }

  const slugList = slugs.split(",").filter(Boolean);
  if (slugList.length === 0) {
    return NextResponse.json({ headlines: {} });
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const sql = neon(connectionString);
    const db = drizzle(sql);

    const coinResults = await db
      .select({ id: coins.id, slug: coins.slug })
      .from(coins)
      .where(inArray(coins.slug, slugList));

    const coinIdToSlug = new Map(coinResults.map((c) => [c.id, c.slug]));
    const coinIds = coinResults.map((c) => c.id);

    if (coinIds.length === 0) {
      return NextResponse.json({ headlines: {} });
    }

    const directPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        sourceType: posts.sourceType,
        publishedAt: posts.publishedAt,
        coinId: posts.coinId,
      })
      .from(posts)
      .where(and(eq(posts.status, "approved"), inArray(posts.coinId, coinIds)))
      .orderBy(desc(posts.publishedAt))
      .limit(limit * slugList.length);

    const junctionPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        sourceType: posts.sourceType,
        publishedAt: posts.publishedAt,
        coinId: postCoins.coinId,
      })
      .from(posts)
      .innerJoin(postCoins, eq(posts.id, postCoins.postId))
      .where(and(eq(posts.status, "approved"), inArray(postCoins.coinId, coinIds)))
      .orderBy(desc(posts.publishedAt))
      .limit(limit * slugList.length);

    const headlines: Record<string, Headline[]> = {};
    slugList.forEach((slug) => {
      headlines[slug] = [];
    });

    const seenBySlug = new Map<string, Set<string>>();
    slugList.forEach((slug) => seenBySlug.set(slug, new Set()));

    const allPosts = [...directPosts, ...junctionPosts];
    allPosts.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    for (const post of allPosts) {
      const slug = coinIdToSlug.get(post.coinId);
      if (!slug) continue;
      
      const seen = seenBySlug.get(slug)!;
      if (seen.has(post.id)) continue;
      if (headlines[slug].length >= limit) continue;
      
      seen.add(post.id);
      headlines[slug].push({
        id: post.id,
        title: post.title,
        sourceType: post.sourceType,
        publishedAt: post.publishedAt?.toISOString() ?? null,
        coinSlug: slug,
      });
    }

    return NextResponse.json({ headlines });
  } catch (error) {
    console.error("Failed to fetch headlines:", error);
    return NextResponse.json({ error: "Failed to fetch headlines" }, { status: 500 });
  }
}
