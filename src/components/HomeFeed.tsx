"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
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

// v1.1: added mole source type
const SOURCES = [
  { key: "all", label: "All" },
  { key: "x", label: "X posts" },
  { key: "blog", label: "Blogs" },
  { key: "announcement", label: "Announcements" },
  { key: "mole", label: "Mole tips" },
];

const sourceLabels: Record<string, string> = {
  x: "X post",
  blog: "Blog",
  announcement: "Announcement",
  call: "Call",
  inbox: "Inbox",
  mole: "Mole tip",
  other: "Other",
};

// v1.1: added mole icon (burrow/nose icon using logo nose colour)
const sourceIcons: Record<string, string> = {
  x: '<path d="M5 4l14 16M19 4L5 20"/>',
  blog: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  announcement: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
  call: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/>',
  mole: '<path d="M5 15c0-5 3-9 7-9s7 4 7 9"/><path d="M3 15h18"/><circle cx="12" cy="11" r="1.4"/>',
  other: '<circle cx="12" cy="12" r="10"/>',
};

// v1.1: mole source uses rose badge
const sourceBadgeType: Record<string, string> = {
  mole: "mole",
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

// v1.1: smaller sparkline dimensions
function sparkPoints(vals: number[]): string {
  if (vals.length < 2) return "";
  const w = 56,
    h = 20;
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  return vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * (w - 2) + 1;
      const y = h - 2 - ((v - min) / range) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

// v1.1: Live price status type
type PriceStatus = "live" | "stale" | "paused";

interface PriceQuote {
  id: string;
  price: number;
  change7d: number;
  ts: number;
}

// v1.1: Live price hook with polling, visibility change, and backoff
function useLivePrices(
  coingeckoIds: string[],
  onQuote: (quote: PriceQuote) => void
) {
  const [status, setStatus] = useState<PriceStatus>("live");
  const [lastTick, setLastTick] = useState<number>(() => Date.now());
  const lastEmit = useRef<Record<string, number>>({});
  const pending = useRef<Record<string, PriceQuote>>({});
  const retryCount = useRef(0);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const staleTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const throttleMs = 1000;
  const staleAfterMs = 30000;
  const pollMs = 15000;

  const deliver = useCallback(
    (q: PriceQuote) => {
      const now = Date.now();
      setLastTick(now);

      if (now - (lastEmit.current[q.id] || 0) >= throttleMs) {
        lastEmit.current[q.id] = now;
        onQuote(q);
      } else if (!pending.current[q.id]) {
        pending.current[q.id] = q;
        setTimeout(() => {
          const p = pending.current[q.id];
          delete pending.current[q.id];
          if (p) {
            lastEmit.current[p.id] = Date.now();
            onQuote(p);
          }
        }, throttleMs - (now - (lastEmit.current[q.id] || 0)));
      } else {
        pending.current[q.id] = q;
      }

      if (status !== "live") setStatus("live");
    },
    [onQuote, status]
  );

  const fetchPrices = useCallback(async () => {
    if (!coingeckoIds.length) return;

    try {
      const response = await fetch(`/api/prices?ids=${coingeckoIds.join(",")}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const quotes: PriceQuote[] = await response.json();
      retryCount.current = 0;
      quotes.forEach(deliver);
    } catch {
      // Backoff on error
    }
  }, [coingeckoIds, deliver]);

  const scheduleReconnect = useCallback(() => {
    const delay =
      Math.min(30000, 1000 * Math.pow(2, retryCount.current++)) *
      (0.8 + Math.random() * 0.4);
    pollTimer.current = setTimeout(() => {
      fetchPrices();
      pollTimer.current = setInterval(fetchPrices, pollMs);
    }, delay);
  }, [fetchPrices]);

  const startPolling = useCallback(() => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    fetchPrices();
    pollTimer.current = setInterval(fetchPrices, pollMs);
  }, [fetchPrices]);

  const stopPolling = useCallback(() => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!coingeckoIds.length) return;

    const handleVisibility = () => {
      if (document.hidden) {
        stopPolling();
        setStatus("paused");
      } else {
        fetchPrices().then(startPolling);
        setStatus("live");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    startPolling();

    staleTimer.current = setInterval(() => {
      if (status === "live" && Date.now() - lastTick > staleAfterMs) {
        setStatus("stale");
        scheduleReconnect();
      }
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stopPolling();
      if (staleTimer.current) clearInterval(staleTimer.current);
    };
  }, [
    coingeckoIds,
    fetchPrices,
    lastTick,
    scheduleReconnect,
    startPolling,
    status,
    stopPolling,
  ]);

  return { status, lastTick };
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
  // v1.1: track flash state per coin for price tick animation
  const [priceFlash, setPriceFlash] = useState<Record<string, "up" | "down" | null>>({});
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const followedCoins = useMemo(
    () => allCoins.filter((c) => followedSlugs.includes(c.slug)),
    [allCoins, followedSlugs]
  );

  const coingeckoIdsList = useMemo(
    () => followedCoins.filter((c) => c.coingeckoId).map((c) => c.coingeckoId!),
    [followedCoins]
  );

  // v1.1: Live price quote handler with flash animation
  const handlePriceQuote = useCallback((quote: PriceQuote) => {
    setMarketData((prev) => {
      const existing = prev[quote.id];
      const prevPrice = existing?.price ?? 0;
      
      // Determine flash direction
      if (prevPrice !== 0 && quote.price !== prevPrice) {
        const direction = quote.price > prevPrice ? "up" : "down";
        setPriceFlash((f) => ({ ...f, [quote.id]: direction }));
        
        // Clear existing timer
        if (flashTimers.current[quote.id]) {
          clearTimeout(flashTimers.current[quote.id]);
        }
        
        // Remove flash after 900ms (flash holds, then fades via CSS)
        flashTimers.current[quote.id] = setTimeout(() => {
          setPriceFlash((f) => ({ ...f, [quote.id]: null }));
        }, 900);
      }

      return {
        ...prev,
        [quote.id]: {
          id: quote.id,
          price: quote.price,
          priceChange24h: quote.change7d,
          sparkline: existing?.sparkline
            ? [...existing.sparkline.slice(1), quote.price]
            : [quote.price],
        },
      };
    });
  }, []);

  // v1.1: Use live prices hook
  const { status: priceStatus, lastTick } = useLivePrices(
    coingeckoIdsList,
    handlePriceQuote
  );

  // Initial market data fetch (for sparkline history)
  useEffect(() => {
    const ids = coingeckoIdsList.join(",");
    if (!ids) return;

    fetch(`/api/market?ids=${ids}`)
      .then((r) => (r.ok ? r.json() : { coins: [] }))
      .then((data) => {
        const map: Record<string, MarketData> = {};
        for (const m of data.coins || []) {
          map[m.id] = m;
        }
        setMarketData(map);
      })
      .catch(console.error);
  }, [coingeckoIdsList]);

  // Cleanup flash timers on unmount
  useEffect(() => {
    const timers = flashTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

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

  // v1.1: Track current time for status display (updates every second)
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // v1.1: Format live status text
  const liveStatusText = useMemo(() => {
    if (priceStatus === "stale") return "Reconnecting prices…";
    if (priceStatus === "paused") return "Prices paused";
    const ago = Math.max(0, Math.round((currentTime - lastTick) / 1000));
    return `Prices live · ${ago < 2 ? "just now" : `${ago}s ago`}`;
  }, [priceStatus, lastTick, currentTime]);

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
              Following {followedSlugs.length} of {allCoins.length} coins · tap
              a coin to filter the feed
            </span>
          </div>
          <div className="cm-burrow__tools">
            {/* v1.1: Live price status */}
            <span
              className="cm-live-status"
              data-state={priceStatus === "stale" ? "stale" : "live"}
            >
              {liveStatusText}
            </span>
            <Link href="/coins">Manage coins →</Link>
          </div>
        </div>
        {/* v1.1: compact single-row chips */}
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
                width="16"
                height="16"
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
            <span className="cm-chip__main">
              <span className="cm-chip__name">
                <strong>All</strong>
              </span>
              <span className="cm-chip__sub">{initialPosts.length} stories</span>
            </span>
          </button>

          {followedCoins.map((coin) => {
            const market = coin.coingeckoId
              ? marketData[coin.coingeckoId]
              : null;
            const isDown = (market?.priceChange24h ?? 0) < 0;
            const postCount = coinCounts[coin.slug] || 0;
            const flash = coin.coingeckoId ? priceFlash[coin.coingeckoId] : null;
            const chipLabel = `${coin.name}, ${market ? formatPrice(market.price) : "—"}, ${market ? formatPercentage(market.priceChange24h) : "—"} over 7 days, ${postCount} new stories`;

            return (
              <button
                key={coin.slug}
                type="button"
                className="cm-chip"
                data-coin={coin.slug}
                aria-pressed={selectedCoin === coin.slug}
                aria-label={chipLabel}
                onClick={() => handleCoinClick(coin.slug)}
              >
                <span className="cm-avatar">
                  <Image
                    src={`/coin-logos/${coin.slug}.png`}
                    alt={coin.ticker}
                    width={32}
                    height={32}
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
                <span className="cm-chip__main">
                  <span className="cm-chip__name">
                    <strong>{coin.name}</strong>
                    <span>{coin.ticker}</span>
                  </span>
                  <span className="cm-chip__quote">
                    <span
                      className="cm-price"
                      data-flash={flash || undefined}
                    >
                      {market ? formatPrice(market.price) : "—"}
                    </span>
                    <span
                      className={`cm-change ${isDown ? "cm-change--down" : ""}`}
                    >
                      {market ? formatPercentage(market.priceChange24h) : "—"}
                    </span>
                  </span>
                </span>
                <span className="cm-chip__side">
                  <span className="cm-badge cm-badge--accent">
                    {postCount} new
                  </span>
                  {market && market.sparkline.length > 0 && (
                    <svg
                      className={`cm-spark ${isDown ? "cm-spark--down" : ""}`}
                      viewBox="0 0 56 20"
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
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add coin
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
          {/* v1.1: Surfacing now moved here from hero */}
          <section className="cm-surfacing" aria-label="Surfacing now">
            <div className="cm-surfacing__head">
              <p className="cm-label">Surfacing now</p>
              <span className="cm-mono text-[11px] text-[var(--cm-text-muted)]">
                auto-updating
              </span>
            </div>
            {initialPosts.slice(0, 3).map((post) => (
              <SurfacingItem key={post.id} post={post} />
            ))}
          </section>

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

          {/* v1.1: updated About copy with team moles */}
          <section className="cm-card">
            <h2 className="cm-label">About</h2>
            <p>
              We aggregate news directly from official project sources: team X
              accounts, blogs, and community calls, plus our moles: contacts on
              each project team who share news with us directly.
            </p>
            <div className="cm-tags">
              <span className="cm-badge cm-badge--neutral">X accounts</span>
              <span className="cm-badge cm-badge--neutral">Blogs</span>
              <span className="cm-badge cm-badge--neutral">Community calls</span>
              <span className="cm-badge cm-badge--mole">Team moles</span>
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

// v1.1: Surfacing item for sidebar card
function SurfacingItem({ post }: { post: Post }) {
  const timeAgo = post.publishedAt
    ? formatRelativeTime(post.publishedAt)
    : "Recently";

  return (
    <Link
      href={`/post/${post.id}`}
      className="cm-surfacing__item"
      title={post.title}
    >
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
      <span>
        <span className="cm-surfacing__title">{post.title}</span>
        <span className="cm-surfacing__meta">
          {post.coin.name} · {sourceLabels[post.sourceType] || post.sourceType}{" "}
          · {timeAgo}
        </span>
      </span>
    </Link>
  );
}

// v1.1: compact featured post (Top dig) — avatar on left, meta row, compact headline
function FeaturedPost({ post }: { post: Post }) {
  const timeAgo = post.publishedAt
    ? formatRelativeTime(post.publishedAt)
    : "Recently";
  const badgeType = sourceBadgeType[post.sourceType] || "neutral";

  return (
    <article className="cm-featured">
      <div className="cm-featured__body">
        <span className="cm-avatar">
          <Image
            src={`/coin-logos/${post.coin.slug}.png`}
            alt={post.coin.ticker}
            width={44}
            height={44}
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
        <div className="cm-featured__main">
          <div className="cm-featured__meta">
            <span className="cm-featured__tag">Top dig</span>
            <strong>{post.coin.name}</strong>
            <span
              className={`cm-badge cm-badge--${badgeType}`}
              dangerouslySetInnerHTML={{
                __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${sourceIcons[post.sourceType] || sourceIcons.other}</svg>${sourceLabels[post.sourceType] || post.sourceType}`,
              }}
            />
            <span className="cm-item__time">{timeAgo} ago</span>
          </div>
          <h3 className="cm-featured__title">
            <Link href={`/post/${post.id}`}>{post.title}</Link>
          </h3>
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

// v1.1: compact feed item with 1-line headline on desktop
function FeedItem({ post }: { post: Post }) {
  const timeAgo = post.publishedAt
    ? formatRelativeTime(post.publishedAt)
    : "—";
  const badgeType = sourceBadgeType[post.sourceType] || "neutral";

  return (
    <li className="cm-item">
      <span className="cm-avatar">
        <Image
          src={`/coin-logos/${post.coin.slug}.png`}
          alt={post.coin.ticker}
          width={34}
          height={34}
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
          <span className={`cm-badge cm-badge--${badgeType}`}>
            <svg
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
        <Link
          href={`/post/${post.id}`}
          className="cm-item__title"
          title={post.title}
        >
          {post.title}
        </Link>
      </div>
    </li>
  );
}
