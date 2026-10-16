import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { posts, coins, type NewPost } from "@/db/schema";
import { eq } from "drizzle-orm";

function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.slice(7);
  return token === process.env.INGEST_API_KEY;
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid Bearer token." },
      { status: 401 }
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
      title,
      summary,
      body: postBody,
      sourceType,
      sourceUrl,
      publishedAt,
    } = body;

    if (!coinSlug || !title) {
      return NextResponse.json(
        { error: "Missing required fields: coinSlug and title are required" },
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

    const sql = neon(connectionString);
    const db = drizzle(sql);

    const coinResults = await db
      .select()
      .from(coins)
      .where(eq(coins.slug, coinSlug));
    const coin = coinResults[0];

    if (!coin) {
      return NextResponse.json(
        { error: `Coin with slug '${coinSlug}' not found` },
        { status: 404 }
      );
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
    };

    const insertedPosts = await db.insert(posts).values(newPost).returning();
    const insertedPost = insertedPosts[0];

    return NextResponse.json(
      {
        success: true,
        message: "Post created as draft. It will be visible after approval.",
        post: {
          id: insertedPost.id,
          title: insertedPost.title,
          status: insertedPost.status,
          coinSlug: coin.slug,
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
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid Bearer token." },
      { status: 401 }
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

    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        summary: posts.summary,
        sourceType: posts.sourceType,
        sourceUrl: posts.sourceUrl,
        publishedAt: posts.publishedAt,
        status: posts.status,
        createdAt: posts.createdAt,
        coinSlug: coins.slug,
        coinName: coins.name,
        coinTicker: coins.ticker,
      })
      .from(posts)
      .innerJoin(coins, eq(posts.coinId, coins.id));

    if (status === "draft" || status === "approved" || status === "rejected") {
      query = query.where(eq(posts.status, status)) as typeof query;
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
