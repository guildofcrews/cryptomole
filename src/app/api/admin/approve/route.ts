import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { posts } from "@/db/schema";
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
    const { postId, action } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "Missing required field: postId" },
        { status: 400 }
      );
    }

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const sql = neon(connectionString);
    const db = drizzle(sql);

    const existingPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId));
    const existingPost = existingPosts[0];

    if (!existingPost) {
      return NextResponse.json(
        { error: `Post with id '${postId}' not found` },
        { status: 404 }
      );
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const updatedPosts = await db
      .update(posts)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId))
      .returning();

    const updatedPost = updatedPosts[0];

    return NextResponse.json({
      success: true,
      message: `Post ${action}d successfully`,
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        status: updatedPost.status,
      },
    });
  } catch (error) {
    console.error("Error updating post status:", error);
    return NextResponse.json(
      { error: "Failed to update post status" },
      { status: 500 }
    );
  }
}
