import {
  db,
  coins,
  posts,
  categories,
  subcategories,
  coinCategories,
  coinSubcategories,
  type Coin,
  type Post,
  type Category,
  type Subcategory,
} from "@/db";
import { desc, eq, and, inArray, sql, isNotNull } from "drizzle-orm";

export type PostWithCoin = Post & { coin: Coin };

export type CategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};

export type CoinWithCategories = Coin & {
  categories: Category[];
  subcategories: Subcategory[];
};

export async function getCoins(): Promise<Coin[]> {
  try {
    return await db.select().from(coins).orderBy(coins.name);
  } catch (error) {
    console.error("Failed to fetch coins:", error);
    return [];
  }
}

export async function getCoinBySlug(slug: string): Promise<CoinWithCategories | null> {
  try {
    const results = await db.select().from(coins).where(eq(coins.slug, slug));
    const coin = results[0];
    if (!coin) return null;

    const catLinks = await db
      .select({ category: categories })
      .from(coinCategories)
      .innerJoin(categories, eq(coinCategories.categoryId, categories.id))
      .where(eq(coinCategories.coinId, coin.id));

    const subLinks = await db
      .select({ subcategory: subcategories })
      .from(coinSubcategories)
      .innerJoin(subcategories, eq(coinSubcategories.subcategoryId, subcategories.id))
      .where(eq(coinSubcategories.coinId, coin.id));

    return {
      ...coin,
      categories: catLinks.map((l) => l.category),
      subcategories: subLinks.map((l) => l.subcategory),
    };
  } catch (error) {
    console.error(`Failed to fetch coin with slug "${slug}":`, error);
    return null;
  }
}

export async function getCategories(): Promise<CategoryWithSubcategories[]> {
  try {
    const cats = await db.select().from(categories).orderBy(categories.name);
    const subs = await db.select().from(subcategories);

    return cats.map((cat) => ({
      ...cat,
      subcategories: subs.filter((s) => s.categoryId === cat.id),
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithSubcategories | null> {
  try {
    const results = await db.select().from(categories).where(eq(categories.slug, slug));
    const category = results[0];
    if (!category) return null;

    const subs = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.categoryId, category.id));

    return { ...category, subcategories: subs };
  } catch (error) {
    console.error(`Failed to fetch category with slug "${slug}":`, error);
    return null;
  }
}

export async function getSubcategoryBySlug(slug: string): Promise<Subcategory | null> {
  try {
    const results = await db.select().from(subcategories).where(eq(subcategories.slug, slug));
    return results[0] ?? null;
  } catch (error) {
    console.error(`Failed to fetch subcategory with slug "${slug}":`, error);
    return null;
  }
}

export async function getCoinsByCategory(categorySlug: string): Promise<Coin[]> {
  try {
    const cat = await db.select().from(categories).where(eq(categories.slug, categorySlug));
    if (!cat[0]) return [];

    const links = await db
      .select({ coinId: coinCategories.coinId })
      .from(coinCategories)
      .where(eq(coinCategories.categoryId, cat[0].id));

    if (links.length === 0) return [];

    const coinIds = links.map((l) => l.coinId);
    return await db
      .select()
      .from(coins)
      .where(inArray(coins.id, coinIds))
      .orderBy(coins.name);
  } catch (error) {
    console.error(`Failed to fetch coins for category "${categorySlug}":`, error);
    return [];
  }
}

export async function getCoinsBySubcategory(subcategorySlug: string): Promise<Coin[]> {
  try {
    const sub = await db.select().from(subcategories).where(eq(subcategories.slug, subcategorySlug));
    if (!sub[0]) return [];

    const links = await db
      .select({ coinId: coinSubcategories.coinId })
      .from(coinSubcategories)
      .where(eq(coinSubcategories.subcategoryId, sub[0].id));

    if (links.length === 0) return [];

    const coinIds = links.map((l) => l.coinId);
    return await db
      .select()
      .from(coins)
      .where(inArray(coins.id, coinIds))
      .orderBy(coins.name);
  } catch (error) {
    console.error(`Failed to fetch coins for subcategory "${subcategorySlug}":`, error);
    return [];
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
        topics: posts.topics,
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
      topics: r.topics,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    }));
  } catch (error) {
    console.error("Failed to fetch approved posts:", error);
    return [];
  }
}

export async function getApprovedPostsByCategory(
  categorySlug: string,
  limit = 50
): Promise<PostWithCoin[]> {
  try {
    const cat = await db.select().from(categories).where(eq(categories.slug, categorySlug));
    if (!cat[0]) return [];

    const links = await db
      .select({ coinId: coinCategories.coinId })
      .from(coinCategories)
      .where(eq(coinCategories.categoryId, cat[0].id));

    if (links.length === 0) return [];

    const coinIds = links.map((l) => l.coinId);

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
        topics: posts.topics,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        coin: coins,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id))
      .where(and(eq(posts.status, "approved"), inArray(posts.coinId, coinIds)))
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
      topics: r.topics,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    }));
  } catch (error) {
    console.error(`Failed to fetch posts for category "${categorySlug}":`, error);
    return [];
  }
}

export async function getApprovedPostsBySubcategory(
  subcategorySlug: string,
  limit = 50
): Promise<PostWithCoin[]> {
  try {
    const sub = await db.select().from(subcategories).where(eq(subcategories.slug, subcategorySlug));
    if (!sub[0]) return [];

    const links = await db
      .select({ coinId: coinSubcategories.coinId })
      .from(coinSubcategories)
      .where(eq(coinSubcategories.subcategoryId, sub[0].id));

    if (links.length === 0) return [];

    const coinIds = links.map((l) => l.coinId);

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
        topics: posts.topics,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        coin: coins,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id))
      .where(and(eq(posts.status, "approved"), inArray(posts.coinId, coinIds)))
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
      topics: r.topics,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    }));
  } catch (error) {
    console.error(`Failed to fetch posts for subcategory "${subcategorySlug}":`, error);
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
        topics: posts.topics,
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
      topics: r.topics,
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
        topics: posts.topics,
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
      topics: r.topics,
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
        topics: posts.topics,
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
      topics: r.topics,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    }));
  } catch (error) {
    console.error("Failed to fetch pending posts:", error);
    return [];
  }
}

export async function getCoinCount(): Promise<number> {
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(coins);
    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error("Failed to count coins:", error);
    return 0;
  }
}

export async function getApprovedPostsWithTopics(limit = 50): Promise<PostWithCoin[]> {
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
        topics: posts.topics,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        coin: coins,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id))
      .where(and(
        eq(posts.status, "approved"),
        isNotNull(posts.topics),
        sql`array_length(${posts.topics}, 1) > 0`
      ))
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
      topics: r.topics,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      coin: r.coin,
    }));
  } catch (error) {
    console.error("Failed to fetch posts with topics:", error);
    return [];
  }
}
