import { db, coins, posts, type Coin, type Post } from "@/db";
import { desc, eq, and } from "drizzle-orm";

export type PostWithCoin = Post & { coin: Coin };

export async function getCoins(): Promise<Coin[]> {
  return db.select().from(coins).orderBy(coins.name);
}

export async function getCoinBySlug(slug: string): Promise<Coin | null> {
  const results = await db.select().from(coins).where(eq(coins.slug, slug));
  return results[0] ?? null;
}

export async function getApprovedPosts(limit = 50): Promise<PostWithCoin[]> {
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
}

export async function getApprovedPostsByCoin(
  coinSlug: string,
  limit = 50
): Promise<PostWithCoin[]> {
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
}

export async function getPostById(id: string): Promise<PostWithCoin | null> {
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
}

export async function getPendingPosts(): Promise<PostWithCoin[]> {
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
}
