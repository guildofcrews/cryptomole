import { NextResponse } from "next/server";
import { db, pageViews, coins, posts } from "@/db";
import { sql, eq, gte, desc } from "drizzle-orm";

export interface SiteStats {
  visitsLast7Days: number;
  visitsPerDay: number;
  uniqueVisitors7Days: number;
  topReferrer: { host: string; share: number } | null;
  mobileShare: number;
  coinsCovered: number;
  storiesPublished: number;
  asOf: string;
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const [
      visitsResult,
      uniqueResult,
      referrersResult,
      deviceResult,
      coinsResult,
      postsResult,
    ] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(pageViews)
        .where(gte(pageViews.viewDate, sevenDaysAgoStr)),

      db
        .select({
          count: sql<number>`count(distinct ${pageViews.visitorHash})::int`,
        })
        .from(pageViews)
        .where(gte(pageViews.viewDate, sevenDaysAgoStr)),

      db
        .select({
          host: pageViews.referrerHost,
          count: sql<number>`count(*)::int`,
        })
        .from(pageViews)
        .where(gte(pageViews.viewDate, sevenDaysAgoStr))
        .groupBy(pageViews.referrerHost)
        .orderBy(desc(sql`count(*)`))
        .limit(10),

      db
        .select({
          deviceType: pageViews.deviceType,
          count: sql<number>`count(*)::int`,
        })
        .from(pageViews)
        .where(gte(pageViews.viewDate, sevenDaysAgoStr))
        .groupBy(pageViews.deviceType),

      db.select({ count: sql<number>`count(*)::int` }).from(coins),

      db
        .select({ count: sql<number>`count(*)::int` })
        .from(posts)
        .where(eq(posts.status, "approved")),
    ]);

    const visitsLast7Days = visitsResult[0]?.count ?? 0;
    const uniqueVisitors7Days = uniqueResult[0]?.count ?? 0;
    const coinsCovered = coinsResult[0]?.count ?? 0;
    const storiesPublished = postsResult[0]?.count ?? 0;

    const visitsPerDay = visitsLast7Days > 0 ? Math.round(visitsLast7Days / 7) : 0;

    let topReferrer: { host: string; share: number } | null = null;
    const topReferrerRow = referrersResult.find((r) => r.host !== null);
    if (topReferrerRow && visitsLast7Days > 0) {
      topReferrer = {
        host: topReferrerRow.host!,
        share: Math.round((topReferrerRow.count / visitsLast7Days) * 100),
      };
    }

    let mobileCount = 0;
    let totalDevices = 0;
    for (const row of deviceResult) {
      totalDevices += row.count;
      if (row.deviceType === "mobile" || row.deviceType === "tablet") {
        mobileCount += row.count;
      }
    }
    const mobileShare = totalDevices > 0 ? Math.round((mobileCount / totalDevices) * 100) : 0;

    const asOf = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });

    const stats: SiteStats = {
      visitsLast7Days,
      visitsPerDay,
      uniqueVisitors7Days,
      topReferrer,
      mobileShare,
      coinsCovered,
      storiesPublished,
      asOf,
    };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

export const revalidate = 300;
