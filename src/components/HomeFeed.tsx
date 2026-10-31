"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFollowedCoins } from "@/hooks/useFollowedCoins";
import { formatPrice, formatPercentage } from "@/lib/coingecko";

interface Category {
  slug: string;
  name: string;
}

interface Coin {
  slug: string;
  name: string;
  ticker: string;
  coingeckoId: string | null;
  categories: string[];
}

interface Post {
  id: string;
  title: string;
  sourceType: string;
  publishedAt: Date | null;
  coin: { slug: string; name: string; ticker: string };
}

interface MarketData {
  id: string;
  price: number;
  priceChange24h: number;
  sparkline: number[];
}

interface HomeFeedProps {
  allCoins: Coin[];
  categories: Category[];
  initialPosts: Post[];
  coinCounts: Record<string, number>;
}

const SOURCES = [
  { key: "all", label: "All" },
  { key: "x", label: "X posts" },
  { key: "blog", label: "Blogs" },
  { key: "announcement", label: "Announcements" },
];

const sourceLabels: Record<string, string> = {
  x: "X post",
  blog: "Blog",
  announcement: "Announcement",
  call: "Call",
  inbox: "Inbox",
  other: "Other",
};

const sourceIcons: Record<string, string> = {
  x: '<path d="M5 4l14 16M19 4L5 20"/>',
  blog: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  announcement: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
  call: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/>',
  other: '<circle cx="12" cy="12" r="10"/>',
};

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

function getAgeHours(date: Date | null): number {
  if (!date) return Infinity;
  const now = new Date();
  return (now.getTime() - date.getTime()) / (1000 * 60 * 60);
}

function sparkPoints(vals: number[]): string {
  if (vals.length < 2) return "";
  const w = 76,
    h = 26;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  return vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * (w - 2) + 1;
      const y = h - 3 - ((v - min) / range) * (h - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function HomeFeed({
  allCoins,
  initialPosts,
  coinCounts,
}: HomeFeedProps) {
  const { followedSlugs, isLoaded } = useFollowedCoins();
  const [selectedCoin, setSelectedCoin] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({});

  const followedCoins = useMemo(
    () => allCoins.filter((c) => followedSlugs.includes(c.slug)),
    [allCoins, followedSlugs]
  );

  const coingeckoIds = useMemo(
    () =>
      followedCoins
        .filter((c) => c.coingeckoId)
        .map((c) => c.coingeckoId)
        .join(","),
    [followedCoins]
  );

  useEffect(() => {
    if (!coingeckoIds) return;

    fetch(`/api/market?ids=${coingeckoIds}`)
      .then((r) => (r.ok ? r.json() : { coins: [] }))
      .then((data) => {
        const map: Record<string, MarketData> = {};
        for (const m of data.coins || []) {
          map[m.id] = m;
        }
        setMarketData(map);
      })
      .catch(console.error);
  }, [coingeckoIds]);

  const handleCoinClick = useCallback((slug: string) => {
    setSelectedCoin((prev) => (prev === slug && slug !== "all" ? "all" : slug));
  }, []);

  const handleSourceClick = useCallback((src: string) => {
    setSelectedSource(src);
  }, []);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCoin =
        selectedCoin === "all" ||
        (selectedCoin === "followed"
          ? followedSlugs.includes(post.coin.slug)
          : post.coin.slug === selectedCoin);
      const matchesSource =
        selectedSource === "all" || post.sourceType === selectedSource;
      return matchesCoin && matchesSource;
    });
  }, [initialPosts, selectedCoin, selectedSource, followedSlugs]);

  const topPost = filteredPosts[0];
  const restPosts = filteredPosts.slice(1);

  const depthGroups = useMemo(() => {
    const surface: Post[] = [];
    const below: Post[] = [];
    const deeper: Post[] = [];

    for (const post of restPosts) {
      const age = getAgeHours(post.publishedAt);
      if (age < 24) surface.push(post);
      else if (age < 72) below.push(post);
      else deeper.push(post);
    }

    return { surface, below, deeper };
  }, [restPosts]);

  const activityData = useMemo(() => {
    const counts: { name: string; count: number }[] = [];
    for (const coin of followedCoins) {
      counts.push({ name: coin.name, count: coinCounts[coin.slug] || 0 });
    }
    return counts.sort((a, b) => b.count - a.count).slice(0, 6);
  }, [followedCoins, coinCounts]);

  const maxActivity = Math.max(...activityData.map((a) => a.count), 1);

  const feedLabel =
    selectedCoin === "all"
      ? `All ${followedCoins.length} coins you follow`
      : followedCoins.find((c) => c.slug === selectedCoin)?.name || "Selected";

  if (!isLoaded) {
    return (
      <div className="cm-container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/10 rounded" />
          <div className="h-64 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Your burrow (coin rail) */}
      <section
        className="cm-container cm-burrow"
        aria-labelledby="burrow-title"
      >
        <div className="cm-burrow__head">
          <div className="cm-burrow__title">
            <h2 id="burrow-title">Your burrow</h2>
            <span>
              Following {followedSlugs.length} of {allCoins.length} coins · tap a
              coin to filter the feed
            </span>
          </div>
          <Link href="/coins">Manage coins →</Link>
        </div>
        <div className="cm-rail">
          <button
            type="button"
            className="cm-chip cm-chip--all"
            data-coin="all"
            aria-pressed={selectedCoin === "all"}
            onClick={() => handleCoinClick("all")}
          >
            <span className="cm-chip__icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </span>
            <span className="cm-chip__name">
              <strong>All coins</strong>
              <span>{initialPosts.length} stories</span>
            </span>
          </button>

          {followedCoins.map((coin) => {
            const market = coin.coingeckoId
              ? marketData[coin.coingeckoId]
              : null;
            const isDown = (market?.priceChange24h ?? 0) < 0;
            const postCount = coinCounts[coin.slug] || 0;

            return (
              <button
                key={coin.slug}
                type="button"
                className="cm-chip"
                data-coin={coin.slug}
                aria-pressed={selectedCoin === coin.slug}
                onClick={() => handleCoinClick(coin.slug)}
              >
                <span className="cm-chip__row">
                  <span className="cm-avatar">
                    <Image
                      src={`/coin-logos/${coin.slug}.png`}
                      alt={coin.ticker}
                      width={38}
                      height={38}
                      className="w-full h-full object-contain"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = coin.ticker.slice(0, 2);
                        }
                      }}
                    />
                  </span>
                  <span className="cm-chip__name">
                    <strong>{coin.name}</strong>
                    <span>{coin.ticker}</span>
                  </span>
                  <span className="cm-badge cm-badge--accent">
                    {postCount} new
                  </span>
                </span>
                <span className="cm-chip__price">
                  <span>
                    <strong>
                      {market ? formatPrice(market.price) : "—"}
                    </strong>
                    <span
                      className={`cm-change ${isDown ? "cm-change--down" : ""}`}
                    >
                      {market
                        ? `${formatPercentage(market.priceChange24h)} · 7d`
                        : "—"}
                    </span>
                  </span>
                  {market && market.sparkline.length > 0 && (
                    <svg
                      className={`cm-spark ${isDown ? "cm-spark--down" : ""}`}
                      viewBox="0 0 76 26"
                      aria-hidden="true"
                    >
                      <polyline points={sparkPoints(market.sparkline)} />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}

          <Link href="/coins" className="cm-chip cm-chip--add">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add a coin
          </Link>
        </div>
      </section>

      {/* Feed + sidebar */}
      <div className="cm-container cm-main">
        <main className="cm-feed">
          <div className="cm-feed__head">
            <div>
              <h2 style={{ display: "inline" }}>The dig</h2>
              <span className="cm-feed__count">
                {feedLabel} · {filteredPosts.length} stories
              </span>
            </div>
            <div
              className="cm-segment"
              role="group"
              aria-label="Filter by source"
            >
              {SOURCES.map((src) => (
                <button
                  key={src.key}
                  type="button"
                  aria-pressed={selectedSource === src.key}
                  onClick={() => handleSourceClick(src.key)}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite">
            {filteredPosts.length === 0 ? (
              <div className="cm-empty">
                Nothing has surfaced for this filter yet. The mole is still
                digging.
              </div>
            ) : (
              <>
                {topPost && <FeaturedPost post={topPost} />}

                {depthGroups.surface.length > 0 && (
                  <DepthGroup
                    variant="surface"
                    label="Surface"
                    sub="last 24 hours"
                    posts={depthGroups.surface}
                  />
                )}

                {depthGroups.below.length > 0 && (
                  <DepthGroup
                    variant="below"
                    label="Just below"
                    sub="2–3 days"
                    posts={depthGroups.below}
                  />
                )}

                {depthGroups.deeper.length > 0 && (
                  <DepthGroup
                    variant="deeper"
                    label="Deeper"
                    sub="earlier this week"
                    posts={depthGroups.deeper}
                  />
                )}
              </>
            )}
          </div>

          <button className="cm-btn cm-btn--secondary cm-more" type="button">
            Dig deeper — load older news
          </button>
        </main>

        <aside className="cm-aside">
          <section className="cm-card">
            <div className="cm-card__head">
              <h2 className="cm-label">Who&apos;s talking · 7 days</h2>
              <span className="cm-mono text-[11px] text-[var(--cm-text-muted)]">
                stories
              </span>
            </div>
            <ul className="cm-activity">
              {activityData.map((item) => (
                <li key={item.name}>
                  <div className="cm-activity__row">
                    <span>{item.name}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="cm-bar">
                    <span
                      style={{
                        width: `${Math.round((item.count / maxActivity) * 100)}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
              {activityData.length === 0 && (
                <li className="text-sm text-[var(--cm-text-muted)]">
                  Follow coins to see activity
                </li>
              )}
            </ul>
          </section>

          <section className="cm-card">
            <h2 className="cm-label">About</h2>
            <p>
              We aggregate news directly from official project sources: team X
              accounts, blogs, and community calls.
            </p>
            <div className="cm-tags">
              <span className="cm-badge cm-badge--neutral">X accounts</span>
              <span className="cm-badge cm-badge--neutral">Blogs</span>
              <span className="cm-badge cm-badge--neutral">Community calls</span>
            </div>
            <Link href="/about">Learn more →</Link>
          </section>

          <section className="cm-card cm-card--cta">
            <h2 className="cm-label">Sponsor Crypto Mole</h2>
            <p>Support independent, source-verified crypto journalism.</p>
            <Link href="/sponsor" className="cm-btn cm-btn--primary">
              Become a sponsor
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  const timeAgo = post.publishedAt
    ? formatRelativeTime(post.publishedAt)
    : "Recently";

  return (
    <article className="cm-featured">
      <div className="cm-featured__body">
        <div className="cm-featured__row">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="cm-featured__tag">Top dig</span>
            <span className="text-[13px] text-[var(--cm-text-muted)]">
              Freshest official update
            </span>
          </div>
          <span className="cm-mono text-[12px] text-[var(--cm-text-muted)]">
            {timeAgo} ago
          </span>
        </div>
        <h3 className="cm-featured__title">
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <div className="cm-featured__row">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="cm-avatar cm-avatar--sm">
              <Image
                src={`/coin-logos/${post.coin.slug}.png`}
                alt={post.coin.ticker}
                width={30}
                height={30}
                className="w-full h-full object-contain"
                unoptimized
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = post.coin.ticker.slice(0, 2);
                  }
                }}
              />
            </span>
            <span className="text-[14px]">{post.coin.name}</span>
            <span className="text-[13px] text-[var(--cm-text-muted)]">
              · {sourceLabels[post.sourceType] || post.sourceType}
            </span>
          </div>
          <Link
            href={`/post/${post.id}`}
            className="cm-btn cm-btn--ghost"
          >
            Read at source
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M8 7h9v9" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function DepthGroup({
  variant,
  label,
  sub,
  posts,
}: {
  variant: "surface" | "below" | "deeper";
  label: string;
  sub: string;
  posts: Post[];
}) {
  const depthClass =
    variant === "surface"
      ? ""
      : variant === "below"
        ? "cm-depth--below"
        : "cm-depth--deeper";

  return (
    <section className={`cm-depth ${depthClass}`} style={{ marginTop: "24px" }}>
      <div className="cm-depth__head">
        <span className="cm-depth__label">{label}</span>
        <span className="cm-depth__sub">{sub}</span>
        <span className="cm-depth__rule" />
      </div>
      <ul className="cm-depth__list">
        {posts.map((post) => (
          <FeedItem key={post.id} post={post} />
        ))}
      </ul>
    </section>
  );
}

function FeedItem({ post }: { post: Post }) {
  const timeAgo = post.publishedAt
    ? formatRelativeTime(post.publishedAt)
    : "—";

  return (
    <li className="cm-item">
      <span className="cm-avatar">
        <Image
          src={`/coin-logos/${post.coin.slug}.png`}
          alt={post.coin.ticker}
          width={38}
          height={38}
          className="w-full h-full object-contain"
          unoptimized
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = post.coin.ticker.slice(0, 2);
            }
          }}
        />
      </span>
      <div className="cm-item__body">
        <div className="cm-item__meta">
          <span className="cm-item__coin">{post.coin.name}</span>
          <span className="cm-badge cm-badge--neutral">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              dangerouslySetInnerHTML={{
                __html: sourceIcons[post.sourceType] || sourceIcons.other,
              }}
            />
            {sourceLabels[post.sourceType] || post.sourceType}
          </span>
          <span className="cm-item__time">{timeAgo}</span>
        </div>
        <Link href={`/post/${post.id}`} className="cm-item__title">
          {post.title}
        </Link>
      </div>
    </li>
  );
}
