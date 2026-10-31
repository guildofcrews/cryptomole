import { NextRequest, NextResponse } from "next/server";
import { db, pageViews, DeviceType } from "@/db";
import { createHash } from "crypto";

const BOT_PATTERNS = [
  /bot/i,
  /spider/i,
  /crawl/i,
  /slurp/i,
  /googlebot/i,
  /bingbot/i,
  /yandex/i,
  /baidu/i,
  /duckduck/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /applebot/i,
  /petalbot/i,
  /semrush/i,
  /ahref/i,
  /mj12bot/i,
  /dotbot/i,
  /rogerbot/i,
  /siteeagle/i,
  /siteimprove/i,
  /headless/i,
  /phantom/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
];

function isBot(userAgent: string): boolean {
  return BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

function getDeviceType(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return "tablet";
  }
  if (
    /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

function getDailySalt(): string {
  const today = new Date().toISOString().split("T")[0];
  const secret = process.env.TRACKING_SALT || "cryptomole-default-salt";
  return `${secret}-${today}`;
}

function hashVisitor(ip: string, userAgent: string): string {
  const salt = getDailySalt();
  const data = `${salt}:${ip}:${userAgent}`;
  return createHash("sha256").update(data).digest("hex");
}

function extractReferrerHost(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (url.hostname === "cryptomole.ai" || url.hostname === "localhost") {
      return null;
    }
    return url.hostname;
  } catch {
    return null;
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get("user-agent") || "";
    const purpose = request.headers.get("purpose") || request.headers.get("sec-purpose") || "";

    if (isBot(userAgent)) {
      return new NextResponse(null, { status: 204 });
    }

    if (purpose.toLowerCase() === "prefetch") {
      return new NextResponse(null, { status: 204 });
    }

    const body = await request.json().catch(() => ({}));
    const path = body.path || "/";
    const referrer = body.referrer || request.headers.get("referer") || null;

    const clientIp = getClientIp(request);
    const visitorHash = hashVisitor(clientIp, userAgent);
    const deviceType = getDeviceType(userAgent);
    const referrerHost = extractReferrerHost(referrer);
    const viewDate = new Date().toISOString().split("T")[0];

    if (!process.env.DATABASE_URL) {
      return new NextResponse(null, { status: 204 });
    }

    await db.insert(pageViews).values({
      viewDate,
      path,
      visitorHash,
      referrerHost,
      deviceType,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Track error:", error);
    return new NextResponse(null, { status: 204 });
  }
}

export const runtime = "nodejs";
