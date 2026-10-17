import { db, coins, posts, type Coin, type Post } from "@/db";
import { desc, eq, and } from "drizzle-orm";

export type PostWithCoin = Post & { coin: Coin };

export async function getCoins(): Promise<Coin[]> {
  try {
    return await db.select().from(coins).orderBy(coins.name);
  } catch (error) {
    console.error("Failed to fetch coins:", error);
    return [];
  }
}

export async function getCoinBySlug(slug: string): Promise<Coin | null> {
  try {
    const results = await db.select().from(coins).where(eq(coins.slug, slug));
    return results[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch coin with slug "${slug}":`, error);
    return null;
  }
}

export async function getApprovedPosts(limit = 50): Promise<PostWithCoin[]> {
  try {
    const results = await db
      .select({
        id: posts.id,
        coinId: posts.coinId,
        title: posts.title,
        summary: posts.summary,
        body: posts.body,
        sourceType: posts.sourceType,
        sourceUrl: posts.sourceUrl,
        publishedAt: posts.publishedAt,
        status: posts.status,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        coin: coins,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id))
      .where(eq(posts.status, "approved"))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return results.map((r) => ({
      id: r.id,
      coinId: r.coinId,
      title: r.title,
      summary: r.summary,
      body: r.body,
      sourceType: r.sourceType,
      sourceUrl: r.sourceUrl,
      publishedAt: r.publishedAt,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    }));
  } catch (error) {
    console.error("Failed to fetch approved posts:", error);
    return [];
  }
}

export async function getApprovedPostsByCoin(
  coinSlug: string,
  limit = 50
): Promise<PostWithCoin[]> {
  try {
    const results = await db
      .select({
        id: posts.id,
        coinId: posts.coinId,
        title: posts.title,
        summary: posts.summary,
        body: posts.body,
        sourceType: posts.sourceType,
        sourceUrl: posts.sourceUrl,
        publishedAt: posts.publishedAt,
        status: posts.status,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        coin: coins,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id))
      .where(and(eq(posts.status, "approved"), eq(coins.slug, coinSlug)))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return results.map((r) => ({
      id: r.id,
      coinId: r.coinId,
      title: r.title,
      summary: r.summary,
      body: r.body,
      sourceType: r.sourceType,
      sourceUrl: r.sourceUrl,
      publishedAt: r.publishedAt,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    }));
  } catch (error) {
    console.error(`Failed to fetch posts for coin "${coinSlug}":`, error);
    return [];
  }
}

export async function getPostById(id: string): Promise<PostWithCoin | null> {
  try {
    const results = await db
      .select({
        id: posts.id,
        coinId: posts.coinId,
        title: posts.title,
        summary: posts.summary,
        body: posts.body,
        sourceType: posts.sourceType,
        sourceUrl: posts.sourceUrl,
        publishedAt: posts.publishedAt,
        status: posts.status,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        coin: coins,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id))
      .where(eq(posts.id, id));

    const r = results[0];
    if (!r) return null;

    return {
      id: r.id,
      coinId: r.coinId,
      title: r.title,
      summary: r.summary,
      body: r.body,
      sourceType: r.sourceType,
      sourceUrl: r.sourceUrl,
      publishedAt: r.publishedAt,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    };
  } catch (error) {
    console.error(`Failed to fetch post with id "${id}":`, error);
    return null;
  }
}

export async function getPendingPosts(): Promise<PostWithCoin[]> {
  try {
    const results = await db
      .select({
        id: posts.id,
        coinId: posts.coinId,
        title: posts.title,
        summary: posts.summary,
        body: posts.body,
        sourceType: posts.sourceType,
        sourceUrl: posts.sourceUrl,
        publishedAt: posts.publishedAt,
        status: posts.status,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        coin: coins,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id))
      .where(eq(posts.status, "draft"))
      .orderBy(desc(posts.createdAt));

    return results.map((r) => ({
      id: r.id,
      coinId: r.coinId,
      title: r.title,
      summary: r.summary,
      body: r.body,
      sourceType: r.sourceType,
      sourceUrl: r.sourceUrl,
      publishedAt: r.publishedAt,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    }));
  } catch (error) {
    console.error("Failed to fetch pending posts:", error);
    return [];
  }
}
