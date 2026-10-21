import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { posts, coins, postCoins, type NewPost, VALID_TOPICS } from "@/db/schema";
import { eq, inArray, and } from "drizzle-orm";

type ApiKeyValidation = 
  | { valid: true }
  | { valid: false; error: string; status: 401 | 503 };

function validateApiKey(request: NextRequest): ApiKeyValidation {
  const apiKey = process.env.INGEST_API_KEY;
  
  if (!apiKey) {
    return {
      valid: false,
      error: "Ingestion API not configured. Set INGEST_API_KEY environment variable.",
      status: 503,
    };
  }
  
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      valid: false,
      error: "Unauthorized. Provide a valid Bearer token.",
      status: 401,
    };
  }
  
  const token = authHeader.slice(7);
  if (token !== apiKey) {
    return {
      valid: false,
      error: "Unauthorized. Invalid API key.",
      status: 401,
    };
  }
  
  return { valid: true };
}

export async function POST(request: NextRequest) {
  const validation = validateApiKey(request);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: validation.status }
    );
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      coinSlug,
      coinSlugs,
      title,
      summary,
      body: postBody,
      sourceType,
      sourceUrl,
      publishedAt,
      topics,
    } = body;

    const primarySlug = coinSlug || (coinSlugs && coinSlugs[0]);
    if (!primarySlug || !title) {
      return NextResponse.json(
        { error: "Missing required fields: coinSlug (or coinSlugs[0]) and title are required" },
        { status: 400 }
      );
    }

    const validSourceTypes = ["x", "inbox", "blog", "call", "announcement", "other"];
    if (sourceType && !validSourceTypes.includes(sourceType)) {
      return NextResponse.json(
        { error: `Invalid sourceType. Must be one of: ${validSourceTypes.join(", ")}` },
        { status: 400 }
      );
    }

    if (topics && Array.isArray(topics)) {
      const invalidTopics = topics.filter((t: string) => !VALID_TOPICS.includes(t as typeof VALID_TOPICS[number]));
      if (invalidTopics.length > 0) {
        return NextResponse.json(
          { error: `Invalid topics: ${invalidTopics.join(", ")}. Must be one of: ${VALID_TOPICS.join(", ")}` },
          { status: 400 }
        );
      }
    }

    const sql = neon(connectionString);
    const db = drizzle(sql);

    const coinResults = await db
      .select()
      .from(coins)
      .where(eq(coins.slug, primarySlug));
    const coin = coinResults[0];

    if (!coin) {
      return NextResponse.json(
        { error: `Coin with slug '${primarySlug}' not found` },
        { status: 404 }
      );
    }

    const allSlugs = coinSlugs && Array.isArray(coinSlugs) ? coinSlugs : [primarySlug];
    const additionalSlugs = allSlugs.filter((s: string) => s !== primarySlug);
    
    let additionalCoins: { id: string; slug: string }[] = [];
    if (additionalSlugs.length > 0) {
      additionalCoins = await db
        .select({ id: coins.id, slug: coins.slug })
        .from(coins)
        .where(inArray(coins.slug, additionalSlugs));
      
      const foundSlugs = additionalCoins.map(c => c.slug);
      const missingSlugs = additionalSlugs.filter((s: string) => !foundSlugs.includes(s));
      if (missingSlugs.length > 0) {
        return NextResponse.json(
          { error: `Coins not found: ${missingSlugs.join(", ")}` },
          { status: 404 }
        );
      }
    }

    const newPost: NewPost = {
      coinId: coin.id,
      title,
      summary: summary || null,
      body: postBody || null,
      sourceType: sourceType || "other",
      sourceUrl: sourceUrl || null,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      status: "draft",
      topics: topics && Array.isArray(topics) && topics.length > 0 ? topics : null,
    };

    const insertedPosts = await db.insert(posts).values(newPost).returning();
    const insertedPost = insertedPosts[0];

    if (additionalCoins.length > 0) {
      const postCoinLinks = additionalCoins.map(c => ({
        postId: insertedPost.id,
        coinId: c.id,
      }));
      await db.insert(postCoins).values(postCoinLinks);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post created as draft. It will be visible after approval.",
        post: {
          id: insertedPost.id,
          title: insertedPost.title,
          status: insertedPost.status,
          coinSlug: coin.slug,
          coinSlugs: allSlugs,
          topics: insertedPost.topics,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const validation = validateApiKey(request);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: validation.status }
    );
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const sql = neon(connectionString);
    const db = drizzle(sql);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const coinSlug = searchParams.get("coin");

    const conditions: ReturnType<typeof eq>[] = [];
    
    if (status === "draft" || status === "approved" || status === "rejected") {
      conditions.push(eq(posts.status, status));
    }
    
    if (coinSlug) {
      conditions.push(eq(coins.slug, coinSlug));
    }

    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        summary: posts.summary,
        sourceType: posts.sourceType,
        sourceUrl: posts.sourceUrl,
        publishedAt: posts.publishedAt,
        status: posts.status,
        topics: posts.topics,
        createdAt: posts.createdAt,
        coinSlug: coins.slug,
        coinName: coins.name,
        coinTicker: coins.ticker,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const results = await query;

    return NextResponse.json({ posts: results });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
