import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCoins, getCategories, getApprovedPosts, getCoinCountsForPosts } from "@/lib/queries";
import { HomeFeed } from "@/components/HomeFeed";

export const dynamic = "force-dynamic";
export const revalidate = 180;

async function HomeContent() {
  const [allCoins, categories, posts, coinCounts] = await Promise.all([
    getCoins(),
    getCategories(),
    getApprovedPosts(50),
    getCoinCountsForPosts(),
  ]);

  const coinsWithData = allCoins.map((coin) => ({
    slug: coin.slug,
    name: coin.name,
    ticker: coin.ticker,
    coingeckoId: coin.coingeckoId,
    categories: [],
  }));

  const categoryList = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  return (
    <HomeFeed
      allCoins={coinsWithData}
      categories={categoryList}
      initialPosts={posts}
      coinCounts={coinCounts}
    />
  );
}

function FeedSkeleton() {
  return (
    <>
      <section className="cm-container cm-burrow">
        <div className="cm-burrow__head">
          <div className="cm-burrow__title">
            <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="cm-rail">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="cm-chip animate-pulse">
              <div className="cm-chip__row">
                <div className="cm-avatar bg-white/10" />
                <div className="cm-chip__name">
                  <div className="h-4 w-20 bg-white/10 rounded" />
                  <div className="h-3 w-12 bg-white/5 rounded mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="cm-container cm-main">
        <main className="cm-feed">
          <div className="cm-feed__head">
            <div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
            <div className="cm-segment">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-20 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="cm-item animate-pulse">
                <div className="cm-avatar bg-white/10" />
                <div className="cm-item__body">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <aside className="cm-aside">
          <div className="cm-card animate-pulse">
            <div className="h-4 w-32 bg-white/10 rounded" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-1.5 w-full bg-white/5 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export default async function HomePage() {
  return (
    <>
      <section className="cm-hero">
        <Image
          src="/brand/hero-strata.svg"
          alt=""
          fill
          className="cm-hero__strata object-cover"
          priority
        />
        <div className="cm-container cm-hero__inner">
          <div className="cm-hero__copy">
            <span className="cm-live-pill">
              <span className="cm-live-dot" />
              Live · official sources only
            </span>
            <h1 className="cm-hero__title">
              Crypto news,
              <br />
              <em>straight from the source.</em>
            </h1>
            <p className="cm-hero__lead">
              We collect announcements from the teams behind each coin — their X
              accounts, blogs and community calls — and surface them here as they
              land.
            </p>
            <div className="cm-hero__actions">
              <Link href="/about" className="cm-btn cm-btn--primary cm-btn--lg">
                Get alerts for my coins
              </Link>
              <Link href="/coins" className="cm-btn cm-btn--secondary cm-btn--lg">
                Browse all 70 coins
              </Link>
            </div>
          </div>

          <Suspense
            fallback={
              <aside className="cm-surfacing" aria-label="Surfacing now">
                <div className="cm-surfacing__head">
                  <p className="cm-label">Surfacing now</p>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="cm-surfacing__item">
                    <div className="cm-avatar bg-white/10 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                      <div className="h-3 w-2/3 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </aside>
            }
          >
            <SurfacingNow />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={<FeedSkeleton />}>
        <HomeContent />
      </Suspense>
    </>
  );
}

async function SurfacingNow() {
  const posts = await getApprovedPosts(3);

  return (
    <aside className="cm-surfacing" aria-label="Surfacing now">
      <div className="cm-surfacing__head">
        <p className="cm-label">Surfacing now</p>
        <span className="cm-mono text-[11px] text-[var(--cm-text-muted)]">
          auto-updating
        </span>
      </div>
      {posts.map((post) => (
        <SurfacingItem key={post.id} post={post} />
      ))}
    </aside>
  );
}

const sourceLabels: Record<string, string> = {
  x: "X post",
  blog: "Blog",
  announcement: "Announcement",
  call: "Call",
  inbox: "Inbox",
  other: "Other",
};

function SurfacingItem({
  post,
}: {
  post: {
    id: string;
    title: string;
    sourceType: string;
    publishedAt: Date | null;
    coin: { slug: string; name: string; ticker: string };
  };
}) {
  const timeAgo = post.publishedAt
    ? formatRelativeTime(post.publishedAt)
    : "Recently";

  return (
    <Link href={`/post/${post.id}`} className="cm-surfacing__item">
      <div className="cm-avatar cm-avatar--md">
        <Image
          src={`/coin-logos/${post.coin.slug}.png`}
          alt={post.coin.ticker}
          width={34}
          height={34}
          className="w-full h-full object-contain p-1"
          unoptimized
        />
      </div>
      <span>
        <span className="cm-surfacing__title">{post.title}</span>
        <span className="cm-surfacing__meta">
          {post.coin.name} · {sourceLabels[post.sourceType] || post.sourceType} ·{" "}
          {timeAgo}
        </span>
      </span>
    </Link>
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
