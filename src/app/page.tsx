import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getCoins,
  getCategories,
  getApprovedPosts,
  getCoinCountsForPosts,
} from "@/lib/queries";
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
      {/* v1.1: compact hero (~200px), one-line headline, actions to the right */}
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
              Live · straight from project teams
            </span>
            <h1 className="cm-hero__title">
              Crypto news, <em>straight from the source.</em>
            </h1>
            <p className="cm-hero__lead">
              Official news from the teams behind each coin — their X accounts,
              blogs and community calls, plus our{" "}
              <strong>moles on project teams</strong> who flag updates shared in
              channels you&apos;d likely miss. Surfaced here the moment it lands.
            </p>
          </div>
          <div className="cm-hero__actions">
            <Link href="/about" className="cm-btn cm-btn--primary">
              Get alerts for my coins
            </Link>
            <Link href="/coins" className="cm-btn cm-btn--secondary">
              Browse all 70 coins
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<FeedSkeleton />}>
        <HomeContent />
      </Suspense>
    </>
  );
}

